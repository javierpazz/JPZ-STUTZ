const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Receipt = require ('../models/receiptModel.js');
const User = require ('../models/userModel.js');
const Encargado = require ('../models/encargadoModel.js');
const Product = require ('../models/productModel.js');
const Configuration = require ('../models/configurationModel.js');
const { isAuth, isAdmin, mailgun, payReceiptEmailTemplate } = require ('../utils.js');

const receiptRouter = express.Router();

receiptRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const receipts = await Receipt.find().populate('user', 'name');
    res.send(receipts);
  })
);
receiptRouter.get(
  '/S',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const receipts = await Receipt.find({ salbuy: 'SALE' });
    res.send(receipts);
  })
);

receiptRouter.get(
  '/B',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const receipts = await Receipt.find({ salbuy: 'BUY' }).populate(
      'user',
      'name'
    );
    res.send(receipts);
  })
);

const PAGE_SIZE = 10;

////////////////////////////

receiptRouter.get(
  '/searchingegrSB',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const encargado = query.encargado || '';
    const order = query.order || '';

    const fechasFilter =
      !fech1 && !fech2 ? {}
    : !fech1 && fech2 ? {
      $or: [
        { recDat: { $lte: fech2}},
        { cajDat: { $lte: fech2}}
          ] 
                }
    : fech1 && !fech2 ? {
      $or: [
        { recDat: { $gte: fech1 } },
        { cajDat: { $gte: fech1 } }
          ]
                }
    : {
      $or: [
        {  recDat: {$gte: fech1, $lte: fech2}},
        {  cajDat: {$gte: fech1, $lte: fech2}}
          ]
        };

    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: configuracion
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: usuario
          }
        : {};
    const encargadoFilter =
      encargado && encargado !== 'all'
          ? {
            id_encarg: encargado
            }
          : {};
  
    const recibos = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...usuarioFilter,
       ...encargadoFilter, cajNum: {$gt : 0}
    })
        .sort({ id_encarg: 1, createdAt: 1 })
        .populate('user', 'name')
        .populate('id_encarg', 'name')
        .populate('id_config', 'name')
        .lean();
  
      // Agrupar y calcular el saldo acumulado
      const resultado = [];
      const agrupadoPorEncargado = {};
  
      for (const r of recibos) {
        const encargadoId = r.id_encarg._id.toString();
        const encargadoNombre = r.id_encarg.name || 'Encargado sin nombre';
  
        if (!agrupadoPorEncargado[encargadoId]) {
          agrupadoPorEncargado[encargadoId] = {
            encargado: encargadoNombre,
            movimientos: [],
            saldoTotal: 0,
          };
        }
  
        let compDesVar ="";
        compDesVar = (r.salbuy === "SALE" ) ? "INGRESO CAJA" : "RETIRO CAJA";

        // if (r.supplier) {
        //   descrip=r.supplier.name
        //   }else {
        //     if (r.id_client) {
        //     descrip=r.id_client.nameCus
        //     } else {
        //       if (r.id_encarg) {descrip=r.id_encarg.name} else {}}}; 



        const movimiento = {
          fecha: r.cajDat || r.recDat,
          compDes: compDesVar,
          nameCus: r.user.name,
          nameCon: r.id_config.name,
          compNum: r.cajNum || r.recNum,
          totalBuy: r.totalBuy || 0,
          total: r.total || 0,
          saldoMovimiento:  (r.total || 0) - (r.totalBuy || 0) ,
        };
        // Acumulado
        const encargado = agrupadoPorEncargado[encargadoId];
        encargado.saldoTotal += movimiento.saldoMovimiento;
        movimiento.saldoAcumulado = encargado.saldoTotal;
  
        encargado.movimientos.push(movimiento);
      }
  
      // Convertir el objeto agrupado a array final
      for (const encargadoId in agrupadoPorEncargado) {
        resultado.push({
          encargado: encargadoId,
          nombreCliente: agrupadoPorEncargado[encargadoId].encargado,
          movimientos: agrupadoPorEncargado[encargadoId].movimientos,
          saldoTotal: agrupadoPorEncargado[encargadoId].saldoTotal,
        });
      }
      res.send({
        resultado,
      });

    })
);




  receiptRouter.get(
  '/searchcajSB',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const encargado = query.encargado || '';
    const order = query.order || '';

    const fechasFilter =
      !fech1 && !fech2 ? {}
    : !fech1 && fech2 ? {
      $or: [
        { recDat: { $lte: fech2}},
        { cajDat: { $lte: fech2}}
          ] 
                }
    : fech1 && !fech2 ? {
      $or: [
        { recDat: { $gte: fech1 } },
        { cajDat: { $gte: fech1 } }
          ]
                }
    : {
      $or: [
        {  recDat: {$gte: fech1, $lte: fech2}},
        {  cajDat: {$gte: fech1, $lte: fech2}}
          ]
        };

    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: configuracion
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: usuario
          }
        : {};
    const encargadoFilter =
      encargado && encargado !== 'all'
        ? {
          id_encarg: encargado
          }
        : {};

    const recibos = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...usuarioFilter,
       ...encargadoFilter,
    })
        .sort({ user: 1, createdAt: 1 })
        .populate('user', 'name')
        .populate('supplier', 'name')
        .populate('id_client', 'nameCus')
        .populate('id_encarg', 'name')
        .lean();
  
      // Agrupar y calcular el saldo acumulado
      const resultado = [];
      const agrupadoPorUser = {};
  
      for (const r of recibos) {
        const userId = r.user._id.toString();
        const userNombre = r.user.name || 'Usuario sin nombre';
  
        if (!agrupadoPorUser[userId]) {
          agrupadoPorUser[userId] = {
            user: userNombre,
            movimientos: [],
            saldoTotal: 0,
          };
        }
  
        let compDesVar ="";
        compDesVar = (r.recNum ) ? "Recibo/O.Pago" : "Ing./Ret. Caja";

        if (r.supplier) {
          descrip=r.supplier.name
          }else {
            if (r.id_client) {
            descrip=r.id_client.nameCus
            } else {
              if (r.id_encarg) {descrip=r.id_encarg.name} else {}}}; 



        const movimiento = {
          fecha: r.cajDat || r.recDat,
          compDes: compDesVar,
          descripcion: descrip,
          compNum: r.cajNum || r.recNum,
          totalBuy: r.totalBuy || 0,
          total: r.total || 0,
          saldoMovimiento:  (r.total || 0) - (r.totalBuy || 0),
        };
  
        // Acumulado
        const user = agrupadoPorUser[userId];
        user.saldoTotal += movimiento.saldoMovimiento;
        movimiento.saldoAcumulado = user.saldoTotal;
  
        user.movimientos.push(movimiento);
      }
  
      // Convertir el objeto agrupado a array final
      for (const userId in agrupadoPorUser) {
        resultado.push({
          user: userId,
          nombreCliente: agrupadoPorUser[userId].user,
          movimientos: agrupadoPorUser[userId].movimientos,
          saldoTotal: agrupadoPorUser[userId].saldoTotal,
        });
      }
      res.send({
        resultado,
      });

    })
);


receiptRouter.get(
  '/searchrecS',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const customer = query.customer || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';

    const fechasFilter =
      !fech1 && !fech2 ? {}
    : !fech1 && fech2 ? {
                  recDat: {
                    $lte: fech2,
                  },
                }
    : fech1 && !fech2 ? {
                  recDat: {
                    $gte: fech1,
                  },
                }
    :                   {
                  recDat: {
                    $gte: fech1,
                    $lte: fech2,
                  },
                };

    const customerFilter =
      customer && customer !== 'all'
        ? {
          id_client: customer
          }
        : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: configuracion
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: usuario
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'mayimporte'
        ? { total: -1 }
        : order === 'menimporte'
        ? { total: 1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { createdAt: 1 };

        // const receipts = await Receipt.find({  id_config : query.id_config, salbuy: 'SALE', recNum: {$gt : 0}})
    const receipts = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...customerFilter,
       ...usuarioFilter,
        salbuy: 'SALE', recNum: {$gt : 0} })
      .populate('id_client', 'nameCus')
      .populate('id_config', 'name')
      .populate('id_encarg', 'name')
      .populate('user', 'name')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    // const countReceipts = await Receipt.countDocuments({ id_config : query.id_config, salbuy: 'SALE', recNum: {$gt : 0} });
    const countReceipts = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...customerFilter,
       ...usuarioFilter,
        salbuy: 'SALE', recNum: {$gt : 0} });

    res.send({
      receipts,
      countReceipts,
      page,
      pages: Math.ceil(countReceipts / pageSize),
    });
  })
);

receiptRouter.get(
  '/searchrecB',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const supplier = query.supplier || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const encargado = query.encargado || '';
    const order = query.order || '';

    const fechasFilter =
      !fech1 && !fech2 ? {}
    : !fech1 && fech2 ? {
                  recDat: {
                    $lte: fech2,
                  },
                }
    : fech1 && !fech2 ? {
                  recDat: {
                    $gte: fech1,
                  },
                }
    :                   {
                  recDat: {
                    $gte: fech1,
                    $lte: fech2,
                  },
                };

    const supplierFilter =
        supplier && supplier !== 'all'
          ? {
            supplier: supplier
            }
          : {};

    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: configuracion
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: usuario
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'mayimporte'
        ? { totalBuy: -1 }
        : order === 'menimporte'
        ? { totalBuy: 1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { createdAt: 1 };

    const receipts = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...supplierFilter,
       ...usuarioFilter,
        salbuy: 'BUY', recNum: {$gt : 0} })
      .populate('supplier', 'name')
      .populate('id_config', 'name')
      .populate('id_encarg', 'name')
      .populate('user', 'name')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countReceipts = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...supplierFilter,
       ...usuarioFilter,
        salbuy: 'BUY', recNum: {$gt : 0} });

    res.send({
      receipts,
      countReceipts,
      page,
      pages: Math.ceil(countReceipts / pageSize),
    });
  })
);

receiptRouter.get(
  '/searchcajS',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const encargado = query.encargado || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';

    const fechasFilter =
      !fech1 && !fech2 ? {}
    : !fech1 && fech2 ? {
                  cajDat: {
                    $lte: fech2,
                  },
                }
    : fech1 && !fech2 ? {
                  cajDat: {
                    $gte: fech1,
                  },
                }
    :                   {
                  cajDat: {
                    $gte: fech1,
                    $lte: fech2,
                  },
                };



    const encargadoFilter =
      encargado && encargado !== 'all'
        ? {
          id_encarg: encargado
          }
        : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: configuracion
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: usuario
          }
        : {};
  
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'mayimporte'
        ? { total: -1 }
        : order === 'menimporte'
        ? { total: 1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { createdAt: 1 };

        // const receipts = await Receipt.find({  id_config : query.id_config, salbuy: 'SALE', recNum: {$gt : 0}})
    const receipts = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...encargadoFilter,
       ...usuarioFilter,
        salbuy: 'SALE', cajNum: {$gt : 0} })
      .populate('id_client', 'nameCus')
      .populate('id_config', 'name')
      .populate('id_encarg', 'name')
      .populate('user', 'name')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    // const countReceipts = await Receipt.countDocuments({ id_config : query.id_config, salbuy: 'SALE', recNum: {$gt : 0} });
    const countReceipts = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...encargadoFilter,
       ...usuarioFilter,
        salbuy: 'SALE', cajNum: {$gt : 0} });

    res.send({
      receipts,
      countReceipts,
      page,
      pages: Math.ceil(countReceipts / pageSize),
    });
  })
);

receiptRouter.get(
  '/searchcajB',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const encargado = query.encargado || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';
    const fechasFilter =
      !fech1 && !fech2 ? {}
    : !fech1 && fech2 ? {
                  cajDat: {
                    $lte: fech2,
                  },
                }
    : fech1 && !fech2 ? {
                  cajDat: {
                    $gte: fech1,
                  },
                }
    :                   {
                  cajDat: {
                    $gte: fech1,
                    $lte: fech2,
                  },
                };


    const encargadoFilter =
        encargado && encargado !== 'all'
          ? {
            id_encarg: encargado
            }
          : {};

    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: configuracion
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: usuario
          }
        : {};
  
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'mayimporte'
        ? { totalBuy: -1 }
        : order === 'menimporte'
        ? { totalBuy: 1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { createdAt: 1 };

    const receipts = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...encargadoFilter,
       ...usuarioFilter,
        salbuy: 'BUY', cajNum: {$gt : 0} })
      .populate('id_client', 'nameCus')
      .populate('id_config', 'name')
      .populate('id_encarg', 'name')
      .populate('user', 'name')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countReceipts = await Receipt.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...encargadoFilter,
       ...usuarioFilter,
        salbuy: 'BUY', cajNum: {$gt : 0} });

    res.send({
      receipts,
      countReceipts,
      page,
      pages: Math.ceil(countReceipts / pageSize),
    });
  })
);


/////////asasas
// receiptRouter.get(
//   '/adminB',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;

//     const receipts = await Receipt.find({  id_config : query.id_config, salbuy: 'BUY', recNum: {$gt : 0} })
//       .populate('user', 'name')
//       .populate('supplier', 'name')
//       .populate('id_encarg', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countReceipts = await Receipt.countDocuments({ id_config : query.id_config, salbuy: 'BUY', recNum: {$gt : 0} });
//     res.send({
//       receipts,
//       countReceipts,
//       page,
//       pages: Math.ceil(countReceipts / pageSize),
//     });
//   })
// );

// receiptRouter.get(
//   '/adminS',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;

//     const receipts = await Receipt.find({  id_config : query.id_config, salbuy: 'SALE', recNum: {$gt : 0}})
//       .populate('id_client', 'nameCus')
//       .populate('supplier', 'name')
//       .populate('id_encarg', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countReceipts = await Receipt.countDocuments({ id_config : query.id_config, salbuy: 'SALE', recNum: {$gt : 0} });
//     res.send({
//       receipts,
//       countReceipts,
//       page,
//       pages: Math.ceil(countReceipts / pageSize),
//     });
//   })
// );

//////////////////caja
// receiptRouter.get(
//   '/cajaB',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;

//     const receipts = await Receipt.find({  id_config : query.id_config, salbuy: 'BUY', cajNum: {$gt : 0}})
//       .populate('user', 'name')
//       .populate('supplier', 'name')
//       .populate('id_encarg', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countReceipts = await Receipt.countDocuments({ id_config : query.id_config, salbuy: 'BUY', cajNum: {$gt : 0} });
//     res.send({
//       receipts,
//       countReceipts,
//       page,
//       pages: Math.ceil(countReceipts / pageSize),
//     });
//   })
// );

// receiptRouter.get(
//   '/cajaS',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;

//     const receipts = await Receipt.find({  id_config : query.id_config, salbuy: 'SALE', cajNum: {$gt : 0} })
//       .populate('id_client', 'nameCus')
//       .populate('supplier', 'name')
//       .populate('id_encarg', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countReceipts = await Receipt.countDocuments({ id_config : query.id_config, salbuy: 'SALE', cajNum: {$gt : 0} });
//     res.send({
//       receipts,
//       countReceipts,
//       page,
//       pages: Math.ceil(countReceipts / pageSize),
//     });
//   })
// );

//////////////////caja


receiptRouter.post(
  '/caja/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
      //////////  numera compCaja /////////////////
      
      if (req.body.cajNum > 0)
        {cajNumero = req.body.cajNum }
        else {
          const configId = req.body.codCon;
          const configuracion = await Configuration.findById(configId);
          if (configuracion) {
            configuracion.numIntCaj = configuracion.numIntCaj + 1;
            await configuracion.save();
          }
          cajNumero = configuracion.numIntCaj;
        };
        //////////  numera compCaja /////////////////
  
    const newReceipt = new Receipt({
      receiptItems: req.body.receiptItems.map((x) => ({
        ...x,
        valuee: x._id,
      })),
      subTotal: req.body.subTotal,
      total: req.body.total,
      totalBuy: req.body.totalBuy,
      // user: req.body.codUse,
      user: req.body.user,
      id_client: req.body.codCus,
      id_config: req.body.codCon,
      id_encarg: req.body.codEnc,
      codConNum: req.body.codConNum,
      supplier: req.body.codSup,
      //////////  numera compCaja /////////////////
      cajNum: cajNumero,
      //////////  numera compCaja /////////////////
      cajDat: req.body.cajDat,
      desVal: req.body.desVal,
      notes: req.body.notes,
      salbuy: req.body.salbuy,
    });
    const receipt = await newReceipt.save();
    res.status(201).send({ message: 'New receipt Created', receipt });
  })
);

receiptRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
      //////////  numera remito /////////////////
      
      if (req.body.recNum > 0)
        {recNumero = req.body.recNum }
        else {
          const configId = req.body.codCon;
          const configuracion = await Configuration.findById(configId);
          if (configuracion) {
            configuracion.numIntRec = configuracion.numIntRec + 1;
            await configuracion.save();
          }
          recNumero = configuracion.numIntRec;
        };
        //////////  numera remito /////////////////
  
    const newReceipt = new Receipt({
      receiptItems: req.body.receiptItems.map((x) => ({
        ...x,
        valuee: x._id,
      })),
      subTotal: req.body.subTotal,
      total: req.body.total,
      totalBuy: req.body.totalBuy,
      // user: req.body.codUse,
      user: req.body.user,
      id_client: req.body.codCus,
      id_config: req.body.codCon,
      codConNum: req.body.codConNum,
      supplier: req.body.codSup,
      //////////  numera remito /////////////////
      recNum: recNumero,
      //////////  numera remito /////////////////
      recDat: req.body.recDat,
      desVal: req.body.desVal,
      notes: req.body.notes,
      salbuy: req.body.salbuy,
    });
    const receipt = await newReceipt.save();
    res.status(201).send({ message: 'New receipt Created', receipt });
  })
);



receiptRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const receipts = await Receipt.aggregate([
      {
        $group: {
          _id: null,
          numReceipts: { $sum: 1 },
          totalSales: { $sum: '$total' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyReceipts = await Receipt.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          receipts: { $sum: 1 },
          sales: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, receipts, dailyReceipts, productCategories });
  })
);

receiptRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const receipts = await Receipt.find({ user: req.user._id });
    res.send(receipts);
  })
);

receiptRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id)
    .populate('id_config')
    .populate('id_client', 'codCus nameCus domcomer cuit coniva')
    .populate('supplier', 'codSup name domcomer cuit coniva')
    .populate('id_encarg', 'name');
    if (receipt) {
      res.send(receipt);
    } else {
      res.status(404).send({ message: 'Receipt Not Found' });
    }
  })
);

receiptRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id);
    if (receipt) {
      receipt.isDelivered = true;
      receipt.deliveredAt = Date.now();
      await receipt.save();
      res.send({ message: 'Receipt Delivered' });
    } else {
      res.status(404).send({ message: 'Receipt Not Found' });
    }
  })
);

receiptRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (receipt) {
      receipt.isPaid = true;
      receipt.paidAt = Date.now();
      receipt.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedReceipt = await receipt.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazona <amazona@mg.yourdomain.com>',
            to: `${receipt.user.name} <${receipt.user.email}>`,
            subject: `New receipt ${receipt._id}`,
            html: payReceiptEmailTemplate(receipt),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Receipt Paid', receipt: updatedReceipt });
    } else {
      res.status(404).send({ message: 'Receipt Not Found' });
    }
  })
);

receiptRouter.delete(
  '/:id',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id);
    if (receipt) {
      await receipt.remove();
      res.send({ message: 'Receipt Deleted' });
    } else {
      res.status(404).send({ message: 'Receipt Not Found' });
    }
  })
);
module.exports = receiptRouter;
