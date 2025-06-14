const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const mongodb = require ('mongodb');
const Invoice = require ('../models/invoiceModel.js');
const Receipt = require ('../models/receiptModel.js');
const User = require ('../models/userModel.js');
const Product = require ('../models/productModel.js');
const Configuration = require ('../models/configurationModel.js');
const Comprobante = require ('../models/comprobanteModel.js');
const { isAuth, isAdmin, mailgun, payInvoiceEmailTemplate } = require ('../utils.js');

const invoiceRouter = express.Router();
const { ObjectId } = mongodb;

invoiceRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.find();
    res.send(invoices);
  })
);
invoiceRouter.get(
  '/searchinvS',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const customer = query.customer || '';
    const comprobante = query.comprobante || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';

    const fechasFilter =
        !fech1 && !fech2 ? {}
      : !fech1 && fech2 ? {
                    invDat: {
                      $lte: fech2,
                    },
                  }
      : fech1 && !fech2 ? {
                    invDat: {
                      $gte: fech1,
                    },
                  }
      :                   {
                    invDat: {
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
    const comprobanteFilter =
      comprobante && comprobante !== 'all'
        ? {
          codCom: comprobante
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

    const invoices = await Invoice.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...customerFilter,
       ...usuarioFilter,
       ...comprobanteFilter,
        salbuy: 'SALE', invNum: {$gt : 0} })
      .populate('id_client', 'nameCus')
      .populate('supplier', 'name')
      .populate('codCom', 'nameCom')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countInvoices = await Invoice.countDocuments({ 
      ...fechasFilter,
      ...configuracionFilter,
      ...customerFilter,
      ...usuarioFilter,
      ...comprobanteFilter,
       salbuy: 'SALE', invNum: {$gt : 0} });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);

invoiceRouter.get(
  '/searchinvB',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const supplier = query.supplier || '';
    const comprobante = query.comprobante || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';

    const fechasFilter =
        !fech1 && !fech2 ? {}
      : !fech1 && fech2 ? {
                    invDat: {
                      $lte: fech2,
                    },
                  }
      : fech1 && !fech2 ? {
                    invDat: {
                      $gte: fech1,
                    },
                  }
      :                   {
                    invDat: {
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
    const comprobanteFilter =
      comprobante && comprobante !== 'all'
        ? {
          codCom: comprobante
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

    const invoices = await Invoice.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...supplierFilter,
       ...usuarioFilter,
       ...comprobanteFilter,
        salbuy: 'BUY', invNum: {$gt : 0} })
      .populate('user', 'name')
      .populate('supplier', 'name')
      .populate('codCom', 'nameCom')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countInvoices = await Invoice.countDocuments({ 
      ...fechasFilter,
      ...configuracionFilter,
      ...supplierFilter,
      ...usuarioFilter,
      ...comprobanteFilter,
       salbuy: 'BUY', invNum: {$gt : 0} });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);

invoiceRouter.get(
  '/searchremS',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const customer = query.customer || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';

    const fechasFilter =
        !fech1 && !fech2 ? {}
      : !fech1 && fech2 ? {
                    remDat: {
                      $lte: fech2,
                    },
                  }
      : fech1 && !fech2 ? {
                    remDat: {
                      $gte: fech1,
                    },
                  }
      :                   {
                    remDat: {
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

    const invoices = await Invoice.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...customerFilter,
       ...usuarioFilter,
        salbuy: 'SALE', remNum: {$gt : 0} })
      .populate('id_client', 'nameCus')
      .populate('supplier', 'name')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countInvoices = await Invoice.countDocuments({ 
      ...fechasFilter,
      ...configuracionFilter,
      ...customerFilter,
      ...usuarioFilter,
       salbuy: 'SALE', remNum: {$gt : 0} });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);
invoiceRouter.get(
  '/searchremB',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const supplier = query.supplier || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';

    const fechasFilter =
        !fech1 && !fech2 ? {}
      : !fech1 && fech2 ? {
                    remDat: {
                      $lte: fech2,
                    },
                  }
      : fech1 && !fech2 ? {
                    remDat: {
                      $gte: fech1,
                    },
                  }
      :                   {
                    remDat: {
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

    const invoices = await Invoice.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...supplierFilter,
       ...usuarioFilter,
        salbuy: 'BUY', remNum: {$gt : 0} })
      .populate('user', 'name')
      .populate('supplier', 'name')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countInvoices = await Invoice.countDocuments({ 
      ...fechasFilter,
      ...configuracionFilter,
      ...supplierFilter,
      ...usuarioFilter,
       salbuy: 'BUY', remNum: {$gt : 0} });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);

invoiceRouter.get(
  '/searchmovS',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const customer = query.customer || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';

    const fechasFilter =
    !fech1 && !fech2 ? {}
  : !fech1 && fech2 ? {
                movpvDat: {
                  $lte: fech2,
                },
              }
  : fech1 && !fech2 ? {
                movpvDat: {
                  $gte: fech1,
                },
              }
  :                   {
                movpvDat: {
                  $gte: fech1,
                  $lte: fech2,
                },
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

    const invoices = await Invoice.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...usuarioFilter,
        salbuy: 'SALE', movpvNum: {$gt : 0} })
      .populate('id_config2', 'name')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countInvoices = await Invoice.countDocuments({ 
      ...fechasFilter,
      ...configuracionFilter,
      ...usuarioFilter,
       salbuy: 'SALE', movpvNum: {$gt : 0} });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);
invoiceRouter.get(
  '/searchmovB',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const supplier = query.supplier || '';
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';

    const fechasFilter =
    !fech1 && !fech2 ? {}
  : !fech1 && fech2 ? {
                movpvDat: {
                  $lte: fech2,
                },
              }
  : fech1 && !fech2 ? {
                movpvDat: {
                  $gte: fech1,
                },
              }
  :                   {
                movpvDat: {
                  $gte: fech1,
                  $lte: fech2,
                },
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

    const invoices = await Invoice.find({
      ...fechasFilter,
      ...configuracionFilter,
       ...usuarioFilter,
        salbuy: 'BUY', movpvNum: {$gt : 0} })
      .populate('id_config2', 'name')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countInvoices = await Invoice.countDocuments({ 
      ...fechasFilter,
      ...configuracionFilter,
      ...usuarioFilter,
       salbuy: 'BUY', movpvNum: {$gt : 0} });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);


invoiceRouter.get(
  '/StoAply/:userId',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.find({
      salbuy: 'SALE',
      recNum: null,
      user: req.params.userId,
    }).populate('user', 'name');
    res.send(invoices);
  })
);

invoiceRouter.get(
  '/BtoAply/:suppId',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.find({
      salbuy: 'BUY',
      recNum: null,
      supplier: req.params.suppId,
    }).populate('supplier', 'name');
    res.send(invoices);
  })
);

invoiceRouter.get(
  '/B',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ salbuy: 'BUY' }).populate(
      'user',
      'name'
    );
    res.send(invoices);
  })
);

invoiceRouter.get(
  '/S',
  // back de S que esta abajo
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ salbuy: 'SALE' });
    res.send(invoices);
  })
);

invoiceRouter.get(
  '/SSSSSS',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.aggregate([
      { $unwind: '$orderItems' },

      {
        $set: {
          salio: {
            $cond: [{ $eq: ['$salbuy', 'SALE'] }, '$orderItems.quantity', 0],
          },
          entro: {
            $cond: [{ $eq: ['$salbuy', 'BUY'] }, '$orderItems.quantity', 0],
          },
        },
      },
    ]);

    res.send(invoices);
  })
);

invoiceRouter.get(
  '/ctaS/:custId',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const factura = 'SALE';

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';


    const fechasInvFilter =
        !fech1 && !fech2 ? {}
      : !fech1 && fech2 ? {
                    invDat: {
                      $lte: fech2,
                    },
                  }
      : fech1 && !fech2 ? {
                    invDat: {
                      $gte: fech1,
                    },
                  }
      :                   {
                    invDat: {
                      $gte: fech1,
                      $lte: fech2,
                    },
                  };

    const fechasRecFilter =
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

    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: new ObjectId(configuracion)
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: new ObjectId(usuario)
          }
        : {};
  
    const sortOrder =
        order === 'newest'
        ? { $sort: { docDat: -1 } }
        : { $sort: { docDat: 1 } }

    const orders = await Invoice.find()
    const ctacte = await Receipt.aggregate([
      {
        $match: {
          $and: [
             fechasRecFilter,
             usuarioFilter,
             configuracionFilter,
             { id_client: new ObjectId(req.params.custId) },
             { salbuy: factura },
             //  { id_config : new ObjectId(query.configuracion)}
            ],
        },
      },
      {
        $set: {
          docDat: '$recDat',
          importeRec: '$total',
          debe: '$total',
        },
      },
      {
        $unionWith: {
          coll: 'orders',
          pipeline: [
            {
              $match: {
                $and: [
                  fechasInvFilter,
                  usuarioFilter,
                  configuracionFilter,
                  { id_client: new ObjectId(req.params.custId) },
                  { salbuy: factura },
                  // { id_config : new ObjectId(query.configuracion)},
                ],
              },
            },
            {
              $set: {
                docDat: '$invDat',
                haber: {
                  $cond: [{ $eq: ['$isHaber', true] }, '$total', 0],
                },
                debe: {
                  $cond: [{ $eq: ['$isHaber', false] }, '$total', 0],
                },
              },
            },
          ],
        },
      },
      sortOrder
    ]);
    res.send(ctacte);
  })
);

/////////////////prosup
invoiceRouter.get(
  '/prosup',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const factura = 'BUY';

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const supplier = query.supplier || '';
    const producto = query.producto || '';
    const order = query.order || '';


    const fechasFilter =
    !fech1 && !fech2 ? {}
  : !fech1 && fech2 ? {
                invDat: {
                  $lte: fech2,
                },
              }
  : fech1 && !fech2 ? {
                invDat: {
                  $gte: fech1,
                },
              }
  :                   {
                invDat: {
                  $gte: fech1,
                  $lte: fech2,
                },
              };


    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: new ObjectId(configuracion)
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: new ObjectId(usuario)
          }
        : {};
    const supplierFilter =
      supplier && supplier !== 'all'
        ? {
          id_client: new ObjectId(supplier)
          }
        : {};
    const productoFilter =
      producto && producto !== 'all'
        ? {
          // orderItems._id: new ObjectId(producto)
          }
        : {};
  
    const sortOrder =
        // order === 'newest'
        // ? { $sort: { id_client: -1, docDat: -1 } }
        // : { $sort: { id_client: -1, docDat: 1 } }
         { $sort: { supplier: -1, docDat: 1 } }


//////ffffffffffffffffffffff
// routes/orders.js
    const resultado = await Invoice.aggregate([
      {
        $match: {
          $and: [
            fechasFilter,
            usuarioFilter,
            supplierFilter,
            configuracionFilter,
            { salbuy: factura },
            ],
        },
      },

      { $unwind: '$orderItems' },
      {
        $group: {
          _id: {
            productTitle: '$orderItems.title',
            supplier: '$supplier',
          },
          totalQuantity: { $sum: '$orderItems.quantity' },
          totalAmount: {
            $sum: {
              $multiply: [
                '$orderItems.quantity',
                '$orderItems.price',
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.productTitle',
          suppliers: {
            $push: {
              supplier: '$_id.supplier',
              totalQuantity: '$totalQuantity',
              totalAmount: '$totalAmount',
            },
          },
          productTotalQuantity: { $sum: '$totalQuantity' },
          productTotalAmount: { $sum: '$totalAmount' },
        },
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'suppliers.supplier',
          foreignField: '_id',
          as: 'suppliersInfo',
        },
      },
      {
        $addFields: {
          suppliers: {
            $map: {
              input: '$suppliers',
              as: 'supplier',
              in: {
                supplier: '$$supplier.supplier',
                supplierName: {
                  $let: {
                    vars: {
                      customer: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$suppliersInfo',
                              as: 'supp',
                              cond: { $eq: ['$$supp._id', '$$supplier.supplier'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ['$$customer.name', 'Cliente desconocido'] },
                  },
                },
                totalQuantity: '$$supplier.totalQuantity',
                totalAmount: '$$supplier.totalAmount',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          suppliers: 1,
          productTotalQuantity: 1,
          productTotalAmount: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.send({
      resultado,
    });

//////ffffffffffffffffffffff
  })
);
/////////////////prosup


/////////////////proiye
invoiceRouter.get(
  '/proiye',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const customer = query.customer || '';
    const producto = query.producto || '';
    const order = query.order || '';


    const fechasFilter =
    !fech1 && !fech2 ? {}
  : !fech1 && fech2 ? {
                invDat: {
                  $lte: fech2,
                },
              }
  : fech1 && !fech2 ? {
                invDat: {
                  $gte: fech1,
                },
              }
  :                   {
                invDat: {
                  $gte: fech1,
                  $lte: fech2,
                },
              };


    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: new ObjectId(configuracion)
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: new ObjectId(usuario)
          }
        : {};
    const customerFilter =
      customer && customer !== 'all'
        ? {
          id_client: new ObjectId(customer)
          }
        : {};
    const productoFilter =
      producto && producto !== 'all'
        ? {
          // orderItems._id: new ObjectId(producto)
          }
        : {};
  
    const sortOrder =
        // order === 'newest'
        // ? { $sort: { id_client: -1, docDat: -1 } }
        // : { $sort: { id_client: -1, docDat: 1 } }
         { $sort: { id_client: -1, docDat: 1 } }


//////ffffffffffffffffffffff
// routes/orders.js
    const resultado = await Invoice.aggregate([
      {
        $match: {
          $and: [
             fechasFilter,
             usuarioFilter,
             customerFilter,
             configuracionFilter,
            ],
        },
      },

      { 
        $unwind: "$orderItems" 
      },
      {
        $group: {
          _id: {
            clientId: "$id_client",
            title: "$orderItems.title"
          },
          totalQuantity: { $sum: "$orderItems.quantity" },
          totalAmount: {
            $sum: {
              $multiply: [
                "$orderItems.quantity",
                "$orderItems.price"
              ]
            }
          },
          totalIngreso: {
            $sum: {
              $cond: [
                { $eq: ["$isHaber", true] },
                "$orderItems.quantity",
                0
              ]
            }
          },
          totalEgreso: {
            $sum: {
              $cond: [
                { $eq: ["$isHaber", false] },
                "$orderItems.quantity",
                0
              ]
            }
          },
          totalMontoIngreso: {
            $sum: {
              $cond: [
                { $eq: ["$isHaber", true] },
                { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
                0
              ]
            }
          },
          totalMontoEgreso: {
            $sum: {
              $cond: [
                { $eq: ["$isHaber", false] },
                { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
                0
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.clientId",
          products: {
            $push: {
              title: "$_id.title",
              totalQuantity: "$totalQuantity",
              totalAmount: "$totalAmount",
              totalIngreso: "$totalIngreso",
              totalEgreso: "$totalEgreso",
              totalMontoIngreso: "$totalMontoIngreso",
              totalMontoEgreso: "$totalMontoEgreso",
              saldo: {
                $subtract: ["$totalMontoIngreso", "$totalMontoEgreso"]
              }            },
          },
          totalAmountClient: { $sum: "$totalMontoIngreso" },
          totalAmountClientBuy: { $sum: "$totalMontoEgreso" },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customers"
        }
      },
      {
        $unwind: {
          path: "$customers",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          clientId: "$customers._id",
          clientNameCus: "$customers.nameCus",
          clientcodCus: "$customers.codCus",
          totalAmountClient: 1,
          totalAmountClientBuy: 1,
          products: 1
        }
      },
      {
        $sort: { clientNameCus: 1 }
      },
    ]);
    res.send({
      resultado,
    });

//////ffffffffffffffffffffff
  })
);
/////////////////proiye

/////////////////procus
invoiceRouter.get(
  '/procus',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const factura = 'SALE';

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const customer = query.customer || '';
    const producto = query.producto || '';
    const order = query.order || '';


    const fechasFilter =
    !fech1 && !fech2 ? {}
  : !fech1 && fech2 ? {
                invDat: {
                  $lte: fech2,
                },
              }
  : fech1 && !fech2 ? {
                invDat: {
                  $gte: fech1,
                },
              }
  :                   {
                invDat: {
                  $gte: fech1,
                  $lte: fech2,
                },
              };


    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: new ObjectId(configuracion)
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: new ObjectId(usuario)
          }
        : {};
    const customerFilter =
      customer && customer !== 'all'
        ? {
          id_client: new ObjectId(customer)
          }
        : {};
    const productoFilter =
      producto && producto !== 'all'
        ? {
          // orderItems._id: new ObjectId(producto)
          }
        : {};
  
    const sortOrder =
        // order === 'newest'
        // ? { $sort: { id_client: -1, docDat: -1 } }
        // : { $sort: { id_client: -1, docDat: 1 } }
         { $sort: { id_client: -1, docDat: 1 } }


//////ffffffffffffffffffffff
// routes/orders.js
    const resultado = await Invoice.aggregate([
      {
        $match: {
          $and: [
            fechasFilter,
            usuarioFilter,
            customerFilter,
            configuracionFilter,
            { salbuy: factura },
            ],
        },
      },

      { $unwind: '$orderItems' },
      {
        $group: {
          _id: {
            productTitle: '$orderItems.title',
            clientId: '$id_client',
          },
          totalQuantity: { $sum: '$orderItems.quantity' },
          totalAmount: {
            $sum: {
              $multiply: [
                '$orderItems.quantity',
                '$orderItems.price',
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.productTitle',
          clients: {
            $push: {
              clientId: '$_id.clientId',
              totalQuantity: '$totalQuantity',
              totalAmount: '$totalAmount',
            },
          },
          productTotalQuantity: { $sum: '$totalQuantity' },
          productTotalAmount: { $sum: '$totalAmount' },
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'clients.clientId',
          foreignField: '_id',
          as: 'customersInfo',
        },
      },
      {
        $addFields: {
          clients: {
            $map: {
              input: '$clients',
              as: 'client',
              in: {
                clientId: '$$client.clientId',
                clientName: {
                  $let: {
                    vars: {
                      customer: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$customersInfo',
                              as: 'cust',
                              cond: { $eq: ['$$cust._id', '$$client.clientId'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ['$$customer.nameCus', 'Cliente desconocido'] },
                  },
                },
                totalQuantity: '$$client.totalQuantity',
                totalAmount: '$$client.totalAmount',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          clients: 1,
          productTotalQuantity: 1,
          productTotalAmount: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.send({
      resultado,
    });

//////ffffffffffffffffffffff
  })
);

/////////////////procus

/////////////////cuspro
invoiceRouter.get(
  '/cuspro',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const factura = 'SALE';

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const customer = query.customer || '';
    const producto = query.producto || '';
    const order = query.order || '';


    const fechasFilter =
    !fech1 && !fech2 ? {}
  : !fech1 && fech2 ? {
                invDat: {
                  $lte: fech2,
                },
              }
  : fech1 && !fech2 ? {
                invDat: {
                  $gte: fech1,
                },
              }
  :                   {
                invDat: {
                  $gte: fech1,
                  $lte: fech2,
                },
              };


    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: new ObjectId(configuracion)
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: new ObjectId(usuario)
          }
        : {};
    const customerFilter =
      customer && customer !== 'all'
        ? {
          id_client: new ObjectId(customer)
          }
        : {};
    const productoFilter =
      producto && producto !== 'all'
        ? {
          // orderItems._id: new ObjectId(producto)
          }
        : {};
  
    const sortOrder =
        // order === 'newest'
        // ? { $sort: { id_client: -1, docDat: -1 } }
        // : { $sort: { id_client: -1, docDat: 1 } }
         { $sort: { id_client: -1, docDat: 1 } }


//////ffffffffffffffffffffff
// routes/orders.js
    const resultado = await Invoice.aggregate([
      {
        $match: {
          $and: [
             fechasFilter,
             usuarioFilter,
             customerFilter,
             configuracionFilter,
             { salbuy: factura },
            ],
        },
      },

      { 
        $unwind: "$orderItems" 
      },
      {
        $group: {
          _id: {
            clientId: "$id_client",
            title: "$orderItems.title"
          },
          totalQuantity: { $sum: "$orderItems.quantity" },
          totalAmount: {
            $sum: {
              $multiply: [
                "$orderItems.quantity",
                "$orderItems.price"
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.clientId",
          products: {
            $push: {
              title: "$_id.title",
              totalQuantity: "$totalQuantity",
              totalAmount: "$totalAmount",
            },
          },
          totalAmountClient: { $sum: '$totalAmount' }, // 🔥 Sumamos todos los productos por cliente
        },
      },
      {
        $lookup: {
          from: "customers", // nombre de la colección de clientes
          localField: "_id",
          foreignField: "_id",
          as: "customers"
        }
      },
      {
        $unwind: {
          path: "$customers",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          clientId: "$customers._id",
          clientNameCus: "$customers.nameCus", // adaptá esto si tu esquema tiene otro campo de nombre
          clientcodCus: "$customers.codCus", // adaptá esto si tu esquema tiene otro campo de nombre
          totalAmountClient: 1, // 🔥 Pasamos el total al front
          products: 1
        }
      },
      {
        $sort: { clientName: 1 }, // 🔥 Ordenamos por nombre del cliente
      },

    ]);
    res.send({
      resultado,
    });

//////ffffffffffffffffffffff
  })
);

/////////////////cuspro

/////////////////suppro

invoiceRouter.get(
  '/suppro',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const factura = 'BUY';

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const supplier = query.supplier || '';
    const producto = query.producto || '';
    const order = query.order || '';


    const fechasFilter =
    !fech1 && !fech2 ? {}
  : !fech1 && fech2 ? {
                invDat: {
                  $lte: fech2,
                },
              }
  : fech1 && !fech2 ? {
                invDat: {
                  $gte: fech1,
                },
              }
  :                   {
                invDat: {
                  $gte: fech1,
                  $lte: fech2,
                },
              };


    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: new ObjectId(configuracion)
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: new ObjectId(usuario)
          }
        : {};
    const supplierFilter =
      supplier && supplier !== 'all'
        ? {
          supplier: new ObjectId(supplier)
          }
        : {};
    const productoFilter =
      producto && producto !== 'all'
        ? {
          // orderItems._id: new ObjectId(producto)
          }
        : {};
  
    const sortOrder =
        // order === 'newest'
        // ? { $sort: { id_client: -1, docDat: -1 } }
        // : { $sort: { id_client: -1, docDat: 1 } }
         { $sort: { id_client: -1, docDat: 1 } }


//////ffffffffffffffffffffff
// routes/orders.js
    const resultado = await Invoice.aggregate([
      {
        $match: {
          $and: [
             fechasFilter,
             usuarioFilter,
             supplierFilter,
             configuracionFilter,
             { salbuy: factura },
            ],
        },
      },
      { 
        $unwind: "$orderItems" 
      },
      {
        $group: {
          _id: {
            supplierId: "$supplier",
            title: "$orderItems.title"
          },
          totalQuantity: { $sum: "$orderItems.quantity" },
          totalAmount: {
            $sum: {
              $multiply: [
                "$orderItems.quantity",
                "$orderItems.price"
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.supplierId",
          products: {
            $push: {
              title: "$_id.title",
              totalQuantity: "$totalQuantity",
              totalAmount: "$totalAmount",
            },
          },
          totalAmountSupplier: { $sum: '$totalAmount' }, // 🔥 Sumamos todos los productos por suppliere
        },
      },
      {
        $lookup: {
          from: "suppliers", // nombre de la colección de supplieres
          localField: "_id",
          foreignField: "_id",
          as: "suppliers"
        }
      },
      {
        $unwind: {
          path: "$suppliers",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          supplierId: "$suppliers._id",
          supplierName: "$suppliers.name", // adaptá esto si tu esquema tiene otro campo de nombre
          suppliercodSup: "$suppliers.codSup", // adaptá esto si tu esquema tiene otro campo de nombre
          totalAmountSupplier: 1, // 🔥 Pasamos el total al front
          products: 1
        }
      },
      {
        $sort: { supplierName: 1 }, // 🔥 Ordenamos por nombre del suppliere
      },

    ]);
    res.send({
      resultado,
    });

//////ffffffffffffffffffffff
  })
);

/////////////////suppro



invoiceRouter.get(
  '/ctacus',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const factura = 'SALE';

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const customer = query.customer || '';
    const order = query.order || '';


    const fechasInvFilter =
        !fech1 && !fech2 ? {}
      : !fech1 && fech2 ? {
                    invDat: {
                      $lte: fech2,
                    },
                  }
      : fech1 && !fech2 ? {
                    invDat: {
                      $gte: fech1,
                    },
                  }
      :                   {
                    invDat: {
                      $gte: fech1,
                      $lte: fech2,
                    },
                  };

    const fechasRecFilter =
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

    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: new ObjectId(configuracion)
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          user: new ObjectId(usuario)
          }
        : {};
    const customerFilter =
      customer && customer !== 'all'
        ? {
          id_client: new ObjectId(customer)
          }
        : {};
  
    const sortOrder =
        // order === 'newest'
        // ? { $sort: { id_client: -1, docDat: -1 } }
        // : { $sort: { id_client: -1, docDat: 1 } }
         { $sort: { id_client: -1, docDat: 1 } }

    const orders = await Invoice.find()
    .populate('user', 'name')
    .populate('id_config', 'name')
    .populate('id_client', 'codCus nameCus' )
    .populate('codCom', 'nameCom ' );    
    const ctacte = await Receipt.aggregate([
      {
        $match: {
          $and: [
             fechasRecFilter,
             usuarioFilter,
             customerFilter,
             configuracionFilter,
             { salbuy: factura },
             //  { id_config : new ObjectId(query.configuracion)}
            ],
        },
      },
      {
        $set: {
          docDat: '$recDat',
          importeRec: '$total',
          debe: '$total',
        },
      },
      {
        $unionWith: {
          coll: 'orders',
          pipeline: [
            {
              $match: {
                $and: [
                  fechasInvFilter,
                  usuarioFilter,
                  customerFilter,
                  configuracionFilter,
                  { salbuy: factura },
                  // { id_config : new ObjectId(query.configuracion)},
                ],
              },
            },
            {
              $set: {
                docDat: '$invDat',
                haber: {
                  $cond: [{ $eq: ['$isHaber', true] }, '$total', 0],
                },
                debe: {
                  $cond: [{ $eq: ['$isHaber', false] }, '$total', 0],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'customers', // nombre de la colección (plural y minúscula en Mongo normalmente)
          localField: 'id_client',  // el campo en receipt/order
          foreignField: '_id',       // el campo en customer
          as: 'customerInfo',        // nombre del array que va a traer la info
        },
      },
      {
        $unwind: { path: '$customerInfo', preserveNullAndEmptyArrays: true }, // para que no venga array
      },
      {
        $lookup: {
          from: 'comprobantes', // nombre de la colección (plural y minúscula en Mongo normalmente)
          localField: 'codCom',  // el campo en receipt/order
          foreignField: '_id',       // el campo en comprobante
          as: 'comprobanteInfo',        // nombre del array que va a traer la info
        },
      },
      {
        $unwind: { path: '$comprobanteInfo', preserveNullAndEmptyArrays: true }, // para que no venga array
      },
      {
        $lookup: {
          from: 'users', // nombre de la colección (plural y minúscula en Mongo normalmente)
          localField: 'user',  // el campo en receipt/order
          foreignField: '_id',       // el campo en user
          as: 'userInfo',        // nombre del array que va a traer la info
        },
      },
      {
        $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true }, // para que no venga array
      },
      {
        $lookup: {
          from: 'configurations', // nombre de la colección (plural y minúscula en Mongo normalmente)
          localField: 'id_config',  // el campo en receipt/order
          foreignField: '_id',       // el campo en configuration
          as: 'configurationInfo',        // nombre del array que va a traer la info
        },
      },
      {
        $unwind: { path: '$configurationInfo', preserveNullAndEmptyArrays: true }, // para que no venga array
      },
      sortOrder
    ]);
    console.log(ctacte)
///////////////////ordena para listar por cliente
      // Agrupar y calcular el saldo acumulado
      const resultado = [];
      const agrupadoPorCustomer = {};
  
      for (const r of ctacte) {
        const customerId = r.customerInfo._id.toString();
        const codCust = r.customerInfo.codCus;
        const customerNombre = r.customerInfo.nameCus || 'Cliente sin nombre';
  
        if (!agrupadoPorCustomer[customerId]) {
          agrupadoPorCustomer[customerId] = {
            codCust: codCust,
            customer: customerNombre,
            movimientos: [],
            saldoTotal: 0,
          };
        }
  
        let descrip=""
        if (r.comprobanteInfo?.nameCom) {
          descrip=r.comprobanteInfo.nameCom;
          }else {
          descrip="RECIBO";
            };


        const movimiento = {
          fecha: r.docDat,
          compDes: descrip,
          nameUse: r.userInfo.name,
          nameCon: r.configurationInfo.name,
          compNum: r.invNum || r.recNum,
          totalBuy: r.debe || 0,
          total: r.haber || 0,
          saldoMovimiento:  (r.haber || 0) - (r.debe || 0) ,
        };
        // Acumulado
        const customer = agrupadoPorCustomer[customerId];
        customer.saldoTotal += movimiento.saldoMovimiento;
        movimiento.saldoAcumulado = customer.saldoTotal;
  
        customer.movimientos.push(movimiento);
      }
  
      // Convertir el objeto agrupado a array final
      for (const customerId in agrupadoPorCustomer) {
        resultado.push({
          customer: customerId,
          codCust: agrupadoPorCustomer[customerId].codCust,
          nombreCliente: agrupadoPorCustomer[customerId].customer,
          movimientos: agrupadoPorCustomer[customerId].movimientos,
          saldoTotal: agrupadoPorCustomer[customerId].saldoTotal,
        });
      }

///////////////////ordena para listar por cliente
    res.send({
      resultado,
    });

  })
);


////ki


invoiceRouter.get(
  '/ctasup',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    console.log("ctasup")

    const { query } = req;
    const factura = 'BUY';

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const supplier = query.supplier || '';
    // const customer = query.customer || '';
    const order = query.order || '';


    const fechasInvFilter =
        !fech1 && !fech2 ? {}
      : !fech1 && fech2 ? {
                    invDat: {
                      $lte: fech2,
                    },
                  }
      : fech1 && !fech2 ? {
                    invDat: {
                      $gte: fech1,
                    },
                  }
      :                   {
                    invDat: {
                      $gte: fech1,
                      $lte: fech2,
                    },
                  };

    const fechasRecFilter =
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

    const configuracionFilter =
      configuracion && configuracion !== 'all'
      ? {
        id_config: new ObjectId(configuracion)
      }
      : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
      ? {
        user: new ObjectId(usuario)
      }
      : {};

      const supplierFilter =
          supplier && supplier !== 'all'
          ? {
            supplier: new ObjectId(supplier)
          }
          : {};
          
      const sortOrder =
          // order === 'newest'
          // ? { $sort: { supplier: -1, docDat: -1 } }
          // : { $sort: { supplier: -1, docDat: 1 } }
          { $sort: { supplier: -1, docDat: 1 } }

    const orders = await Invoice.find()
    .populate('user', 'name')
    .populate('id_config', 'name')
    .populate('supplier', 'codSup name')
    .populate('codCom', 'nameCom ' );

    const ctacte = await Receipt.aggregate([
      {
        $match: {
          $and: [
             fechasRecFilter,
             usuarioFilter,
             supplierFilter,
             configuracionFilter,
             { salbuy: factura },
             //  { id_config : new ObjectId(query.configuracion)}
            ],
        },
      },
      {
        $set: {
          docDat: '$recDat',
          importeRec: '$totalBuy',
          haber: '$totalBuy',
        },
      },
      {
        $unionWith: {
          coll: 'orders',
          pipeline: [
            {
              $match: {
                $and: [
                  fechasInvFilter,
                  usuarioFilter,
                  supplierFilter,
                  configuracionFilter,
                  { salbuy: factura },
                  // { id_config : new ObjectId(query.configuracion)},
                ],
              },
            },
            {
              $set: {
                docDat: '$invDat',
                haber: {
                  $cond: [{ $eq: ['$isHaber', true] }, '$totalBuy', 0],
                },
                debe: {
                  $cond: [{ $eq: ['$isHaber', false] }, '$totalBuy', 0],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'suppliers', // nombre de la colección (plural y minúscula en Mongo normalmente)
          localField: 'supplier',  // el campo en receipt/order
          foreignField: '_id',       // el campo en supplier
          as: 'supplierInfo',        // nombre del array que va a traer la info
        },
      },
      {
        $unwind: { path: '$supplierInfo', preserveNullAndEmptyArrays: true }, // para que no venga array
      },
      {
        $lookup: {
          from: 'comprobantes', // nombre de la colección (plural y minúscula en Mongo normalmente)
          localField: 'codCom',  // el campo en receipt/order
          foreignField: '_id',       // el campo en comprobante
          as: 'comprobanteInfo',        // nombre del array que va a traer la info
        },
      },
      {
        $unwind: { path: '$comprobanteInfo', preserveNullAndEmptyArrays: true }, // para que no venga array
      },
      {
        $lookup: {
          from: 'users', // nombre de la colección (plural y minúscula en Mongo normalmente)
          localField: 'user',  // el campo en receipt/order
          foreignField: '_id',       // el campo en user
          as: 'userInfo',        // nombre del array que va a traer la info
        },
      },
      {
        $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true }, // para que no venga array
      },
      {
        $lookup: {
          from: 'configurations', // nombre de la colección (plural y minúscula en Mongo normalmente)
          localField: 'id_config',  // el campo en receipt/order
          foreignField: '_id',       // el campo en configuration
          as: 'configurationInfo',        // nombre del array que va a traer la info
        },
      },
      {
        $unwind: { path: '$configurationInfo', preserveNullAndEmptyArrays: true }, // para que no venga array
      },
      sortOrder
    ]);
    console.log(ctacte)
///////////////////ordena para listar por cliente
      // Agrupar y calcular el saldo acumulado
      const resultado = [];
      const agrupadoPorSupplier = {};
  
      for (const r of ctacte) {
        const supplierId = r.supplierInfo._id.toString();
        const codSupp = r.supplierInfo.codSup;
        const supplierNombre = r.supplierInfo.name || 'Proovedor sin nombre';
  
        if (!agrupadoPorSupplier[supplierId]) {
          agrupadoPorSupplier[supplierId] = {
            codSupp: codSupp,
            supplier: supplierNombre,
            movimientos: [],
            saldoTotal: 0,
          };
        }
  
        let descrip=""
        if (r.comprobanteInfo?.nameCom) {
          descrip=r.comprobanteInfo.nameCom;
          }else {
          descrip="ORDEN DE PAGO";
            };


        const movimiento = {
          fecha: r.docDat,
          compDes: descrip,
          nameUse: r.userInfo.name,
          nameCon: r.configurationInfo.name,
          compNum: r.invNum || r.recNum,
          totalBuy: r.debe || 0,
          total: r.haber || 0,
          saldoMovimiento:  (r.haber || 0) - (r.debe || 0) ,
        };
        // Acumulado
        const supplier = agrupadoPorSupplier[supplierId];
        supplier.saldoTotal += movimiento.saldoMovimiento;
        movimiento.saldoAcumulado = supplier.saldoTotal;
  
        supplier.movimientos.push(movimiento);
      }
  
      // Convertir el objeto agrupado a array final
      for (const supplierId in agrupadoPorSupplier) {
        resultado.push({
          supplier: supplierId,
          codSupp: agrupadoPorSupplier[supplierId].codSupp,
          nombreSupplier: agrupadoPorSupplier[supplierId].supplier,
          movimientos: agrupadoPorSupplier[supplierId].movimientos,
          saldoTotal: agrupadoPorSupplier[supplierId].saldoTotal,
        });
      }

///////////////////ordena para listar por cliente
    res.send({
      resultado,
    });

  })
);

////ki




invoiceRouter.get(
  '/ctaB/:suppliId',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const factura = 'BUY';

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const configuracion = query.configuracion || '';
    const usuario = query.usuario || '';
    const order = query.order || '';


    const fechasInvFilter =
        !fech1 && !fech2 ? {}
      : !fech1 && fech2 ? {
                    invDat: {
                      $lte: fech2,
                    },
                  }
      : fech1 && !fech2 ? {
                    invDat: {
                      $gte: fech1,
                    },
                  }
      :                   {
                    invDat: {
                      $gte: fech1,
                      $lte: fech2,
                    },
                  };

    const fechasRecFilter =
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

    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config : new ObjectId(configuracion)
        }
        : {};

      const usuarioFilter =
        usuario && usuario !== 'all'
          ? {
            user: new ObjectId(usuario)
            }
          : {};

        const sortOrder =
        order === 'newest'
        ? { $sort: { docDat: -1 } }
        : { $sort: { docDat: 1 } }


    const orders = await Invoice.find();
    const ctacte = await Receipt.aggregate([
      {
        $match: {
          $and: [
            fechasRecFilter,
            configuracionFilter,
            usuarioFilter,
            { supplier: new ObjectId(req.params.suppliId) },
            { salbuy: factura },
          ],
        },
      },
      {
        $set: {
          docDat: '$recDat',
          importeRec: '$total',
        },
      },
      {
        $unionWith: {
          coll: 'orders',
          pipeline: [
            {
              $match: {
                $and: [
                  fechasInvFilter,
                  configuracionFilter,
                  usuarioFilter,
                  { supplier: new ObjectId(req.params.suppliId) },
                  { salbuy: factura },
                ],
              },
            },
            {
              $set: {
                docDat: '$invDat',
              },
            },
          ],
        },
      },
      sortOrder
    ]);

    res.send(ctacte);
  })
);

const PAGE_SIZE = 10;

// invoiceRouter.get(
//   '/adminS',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;
    
//     const invoices = await Invoice.find({ id_config : query.id_config, salbuy: 'SALE', invNum: {$gt : 0} })
//       .populate('id_client', 'nameCus')
//       .populate('supplier', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countInvoices = await Invoice.countDocuments({ id_config : query.id_config, salbuy: 'SALE', invNum: {$gt : 0} });
//     res.send({
//       invoices,
//       countInvoices,
//       page,
//       pages: Math.ceil(countInvoices / pageSize),
//     });
//   })
// );

// invoiceRouter.get(
//   '/adminB',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;

//     const invoices = await Invoice.find({ id_config : query.id_config, salbuy: 'BUY', invNum: {$gt : 0} })
//       .populate('user', 'name')
//       .populate('supplier', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countInvoices = await Invoice.countDocuments({ id_config : query.id_config, salbuy: 'BUY', invNum: {$gt : 0} });
//     res.send({
//       invoices,
//       countInvoices,
//       page,
//       pages: Math.ceil(countInvoices / pageSize),
//     });
//   })
// );

// ///////////////////////remito
// invoiceRouter.get(
//   '/remitS',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;
    
//     const invoices = await Invoice.find({ id_config : query.id_config, salbuy: 'SALE', remNum : {$gt : 0} })
//       .populate('id_client', 'nameCus')
//       .populate('supplier', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countInvoices = await Invoice.countDocuments({ id_config : query.id_config, salbuy: 'SALE', remNum : {$gt : 0}});
//     res.send({
//       invoices,
//       countInvoices,
//       page,
//       pages: Math.ceil(countInvoices / pageSize),
//     });
//   })
// );

// invoiceRouter.get(
//   '/remitB',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;

//     const invoices = await Invoice.find({ id_config : query.id_config, salbuy: 'BUY', remNum : {$gt : 0} })
//       .populate('user', 'name')
//       .populate('supplier', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countInvoices = await Invoice.countDocuments({ id_config : query.id_config, salbuy: 'BUY', remNum : {$gt : 0} });
//     res.send({
//       invoices,
//       countInvoices,
//       page,
//       pages: Math.ceil(countInvoices / pageSize),
//     });
//   })
// );
// ///////////////////////remito
// ///////////////////////movim
// invoiceRouter.get(
//   '/movimS',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;
    
//     const invoices = await Invoice.find({ id_config : query.id_config, salbuy: 'SALE', movpvNum : {$gt : 0} })
//       .populate('id_config2', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countInvoices = await Invoice.countDocuments({ id_config : query.id_config, salbuy: 'SALE', movpvNum : {$gt : 0}});
//     res.send({
//       invoices,
//       countInvoices,
//       page,
//       pages: Math.ceil(countInvoices / pageSize),
//     });
//   })
// );

// invoiceRouter.get(
//   '/movimB',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;

//     const invoices = await Invoice.find({ id_config : query.id_config, salbuy: 'BUY', movpvNum : {$gt : 0} })
//       .populate('id_config2', 'name')
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countInvoices = await Invoice.countDocuments({ id_config : query.id_config, salbuy: 'BUY', movpvNum : {$gt : 0} });
//     res.send({
//       invoices,
//       countInvoices,
//       page,
//       pages: Math.ceil(countInvoices / pageSize),
//     });
//   })
// );
// ///////////////////////movim

invoiceRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
      //////////  numera factura /////////////////
      
      if (req.body.invNum > 0)
        {invNumero = req.body.invNum }
        else {
          const comproId = req.body.codCom;
          const comprobante = await Comprobante.findById(comproId);
          if (comprobante) {
            comprobante.numInt = comprobante.numInt + 1;
            await comprobante.save();
          }
          invNumero = comprobante.numInt;
        };
        //////////  numera factura /////////////////
        
        const newInvoice = new Invoice({
          orderItems: req.body.orderItems.map((x) => ({
            ...x,
            product: x._id,
          })),
          shippingAddress: req.body.shippingAddress,
          paymentMethod: req.body.paymentMethod,
          subTotal: req.body.subTotal,
          shippingPrice: req.body.shippingPrice,
          tax: req.body.tax,
          total: req.body.total,
          totalBuy: req.body.totalBuy,
          user: req.body.codUse,
          id_client: req.body.codCus,
          id_config: req.body.codCon,
          user: req.body.user,
          codConNum: req.body.codConNum,
          codCom: req.body.codCom,
          supplier: req.body.codSup,
          remNum: req.body.remNum,
          remDat: req.body.remDat,
          //////////  numera factura /////////////////
          invNum: invNumero,
          //////////  numera factura /////////////////
          invDat: req.body.invDat,
          recNum: req.body.recNum,
          recDat: req.body.recDat,
          desVal: req.body.desVal,
          notes: req.body.notes,
          salbuy: req.body.salbuy,
          // //////////  Me fijo si es Compra o venta para ver haber o debe /////////////////
          isHaber: (req.body.salbuy === "SALE") ? req.body.isHaber : !req.body.isHaber,
          // //////////  Me fijo si es Compra o venta para ver haber o debe /////////////////
        });
        const invoice = await newInvoice.save();
        res.status(201).send({ message: 'New Invoice Created', invoice });
      })
    );
    
    invoiceRouter.post(
      '/rem/',
      isAuth,
  expressAsyncHandler(async (req, res) => {

    //////////  numera remito /////////////////
      
      if (req.body.remNum > 0)
      {remNumero = req.body.remNum }
      else {
        const configId = req.body.codCon;
        const configuracion = await Configuration.findById(configId);
        if (configuracion) {
          configuracion.numIntRem = configuracion.numIntRem + 1;
          await configuracion.save();
        }
        remNumero = configuracion.numIntRem;
      };
      //////////  numera remito /////////////////

    const newInvoice = new Invoice({
      orderItems: req.body.orderItems.map((x) => ({
        ...x,
        product: x._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      subTotal: req.body.subTotal,
      shippingPrice: req.body.shippingPrice,
      tax: req.body.tax,
      total: req.body.total,
      totalBuy: req.body.totalBuy,
      user: req.body.codUse,
      id_client: req.body.codCus,
      id_config: req.body.codCon,
      user: req.body.user,
      id_config2: req.body.codCon2,
      movpvNum: req.body.movpvNum,
      movpvDat: req.body.movpvDat,
      codConNum: req.body.codConNum,
      codCom: req.body.codCom,
      supplier: req.body.codSup,
      //////////  numera remito /////////////////
      remNum: remNumero,
      //////////  numera remito /////////////////
      remDat: req.body.remDat,
      invNum: req.body.invNum,
      invDat: req.body.invDat,
      recNum: req.body.recNum,
      recDat: req.body.recDat,
      desVal: req.body.desVal,
      notes: req.body.notes,
      salbuy: req.body.salbuy,
    });
    const invoice = await newInvoice.save();
    res.status(201).send({ message: 'New Invoice Created', invoice });
  })
);

invoiceRouter.post(
  '/mov/',
  isAuth,
  expressAsyncHandler(async (req, res) => {

    //////////  numera movim /////////////////
      
      if (req.body.movpvNum > 0)
      {movpvNumero = req.body.movpvNum }
      else {
        const configId = req.body.codCon;
        const configuracion = await Configuration.findById(configId);
        if (configuracion) {
          configuracion.numIntMov = configuracion.numIntMov + 1;
          await configuracion.save();
        }
        movpvNumero = configuracion.numIntMov;
      };
      //////////  numera movim /////////////////

    const newInvoice = new Invoice({
      orderItems: req.body.orderItems.map((x) => ({
        ...x,
        product: x._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      subTotal: req.body.subTotal,
      shippingPrice: req.body.shippingPrice,
      tax: req.body.tax,
      total: req.body.total,
      totalBuy: req.body.totalBuy,
      user: req.body.user,
      // user: req.body.codUse,
      id_client: req.body.codCus,
      id_config: req.body.codCon,
      id_config2: req.body.codCon2,
      codConNum: req.body.codConNum,
      codCom: req.body.codCom,
      supplier: req.body.codSup,
      //////////  numera remito /////////////////
      movpvNum: movpvNumero,
      //////////  numera remito /////////////////
      movpvDat: req.body.movpvDat,
      invNum: req.body.invNum,
      invDat: req.body.invDat,
      recNum: req.body.recNum,
      recDat: req.body.recDat,
      desVal: req.body.desVal,
      notes: req.body.notes,
      salbuy: req.body.salbuy,
    });
    const invoice = await newInvoice.save();
    res.status(201).send({ message: 'New Invoice Created', invoice });
  })
);


invoiceRouter.get(
  '/summary1111',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          numInvoices: { $sum: 1 },
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
    const dailyInvoices = await Invoice.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          invoices: { $sum: 1 },
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
    res.send({ users, invoices, dailyInvoices, productCategories });
  })
);

invoiceRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
    .populate('id_client', 'codCus nameCus domcomer cuit coniva')
    .populate('supplier', 'codSup name domcomer cuit coniva')
    .populate('codCom', 'codCom nameCom noDisc toDisc itDisc')
    .populate('id_config2', 'name domcomer cuit coniva ib feciniact');
    if (invoice) {
      res.send(invoice);
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);


invoiceRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const invoices = await Invoice.find({ user: req.user._id })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countInvoices = await Invoice.countDocuments();

    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);

invoiceRouter.put(
  '/:id/applycha',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    //    console.log(req.body.recNum);
    if (invoice) {
      invoice.remNum = req.body.remNum;
      invoice.invNum = req.body.invNum;
      invoice.staOrd = req.body.staOrd;
      await invoice.save();
      res.send({ message: 'Remit Invoice Number Changed successfully' });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

invoiceRouter.put(
  '/:id/deleteinvoice',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    //    console.log(req.body.recNum);
    if (invoice) {
      (invoice.remNum = null),
        (invoice.invNum = null),
        (invoice.invDat = null),
        (invoice.recNum = null),
        (invoice.recDat = null),
        (invoice.desVal = null),
        (invoice.notes = null),
        (invoice.salbuy = null),
        await invoice.save();
      res.send({ message: 'Remit Invoice Number Changed successfully' });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

invoiceRouter.put(
  '/:id/applyfac',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    //    console.log(req.body.recNum);
    if (invoice) {
      invoice.remNum = req.body.remNum;
      invoice.invNum = req.body.invNum;
      invoice.invDat = req.body.invDat;
      invoice.recNum = req.body.recNum;
      invoice.recDat = req.body.recDat;
      invoice.desVal = req.body.desVal;
      invoice.notes = req.body.notes;
      invoice.salbuy = req.body.salbuy;
      await invoice.save();
      res.send({ message: 'Receipt Apllied' });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

//di
invoiceRouter.put(
  '/:id/unapplyrecS',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    await Invoice.updateMany({ recNum: req.body.recNum, user: req.body.user }, { $set: { recNum: null }}) 
    
    // const invoice = await Invoice.find({recNum: req.params.id });
    // //    console.log(req.body.recNum);
    // if (invoice) {
    //   invoice.recNum = "";
    //   invoice.recDat = "";
      // await invoice.save();
      // res.send({ message: 'Receipt Unapplied' });
    // } else {
      // res.status(404).send({ message: 'Invoice Not Found' });
    // }
  })
);

invoiceRouter.put(
  '/:id/unapplyrecB',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    await Invoice.updateMany({ recNum: req.body.recNum, supplier: req.body.supplier }, { $set: { recNum: null }}) 
    
    // const invoice = await Invoice.find({recNum: req.params.id });
    // //    console.log(req.body.recNum);
    // if (invoice) {
    //   invoice.recNum = "";
    //   invoice.recDat = "";
      // await invoice.save();
      // res.send({ message: 'Receipt Unapplied' });
    // } else {
      // res.status(404).send({ message: 'Invoice Not Found' });
    // }
  })
);


//di

invoiceRouter.put(
  '/:id/applyrec',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    //    console.log(req.body.recNum);
    if (invoice) {
      invoice.recNum = req.body.recNum;
      invoice.recDat = req.body.recDat;
      await invoice.save();
      res.send({ message: 'Receipt Apllied' });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

invoiceRouter.put(
  '/:id/applyrecbuy',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    //    console.log(req.body.recNum);
    if (invoice) {
      invoice.recNum = req.body.recNum;
      invoice.recDat = req.body.recDat;
      await invoice.save();
      res.send({ message: 'Receipt Apllied' });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

invoiceRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (invoice) {
      invoice.isDelivered = true;
      invoice.deliveredAt = Date.now();
      await invoice.save();
      res.send({ message: 'Invoice Delivered' });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

invoiceRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (invoice) {
      invoice.isPaid = true;
      invoice.paidAt = Date.now();
      invoice.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedInvoice = await invoice.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazona <amazona@mg.yourdomain.com>',
            to: `${invoice.user.name} <${invoice.user.email}>`,
            subject: `New invoice ${invoice._id}`,
            html: payInvoiceEmailTemplate(invoice),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Invoice Paid', invoice: updatedInvoice });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

invoiceRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (invoice) {
      await invoice.remove();
      res.send({ message: 'Invoice Deleted' });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);



module.exports = invoiceRouter;
