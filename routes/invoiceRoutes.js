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
  '/ctaS/:userId',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const factura = 'SALE';
    const orders = await Invoice.find();
    const ctacte = await Receipt.aggregate([
      {
        $match: {
          $and: [{ id_client: new ObjectId(req.params.userId) }, { salbuy: factura }],
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
                  { id_client: new ObjectId(req.params.userId) },
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
    ]);
    
    res.send(ctacte);
  })
);

invoiceRouter.get(
  '/ctaB/:suppliId',

  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const factura = 'BUY';
    const orders = await Invoice.find();

    const ctacte = await Receipt.aggregate([
      {
        $match: {
          $and: [
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
    ]);

    res.send(ctacte);
  })
);

const PAGE_SIZE = 10;

invoiceRouter.get(
  '/adminS',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const invoices = await Invoice.find({ salbuy: 'SALE' })
      .populate('id_client', 'nameCus')
      .populate('supplier', 'name')
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countInvoices = await Invoice.countDocuments({ salbuy: 'SALE' });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);

invoiceRouter.get(
  '/adminB',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const invoices = await Invoice.find({ salbuy: 'BUY' })
      .populate('user', 'name')
      .populate('supplier', 'name')
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countInvoices = await Invoice.countDocuments({ salbuy: 'BUY' });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);

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



invoiceRouter.get(
  '/summary',
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
    const invoice = await Invoice.findById(req.params.id).populate(
      'user',
      'name'
    );
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
