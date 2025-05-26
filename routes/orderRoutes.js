const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Invoice = require ('../models/invoiceModel.js');
const Receipt = require ('../models/receiptModel.js');
const User = require ('../models/userModel.js');
const Customer = require ('../models/customerModel.js');
const Product = require ('../models/productModel.js');
const { isAuth, isAdmin, mailgun, payOrderEmailTemplate } = require ('../utils.js');
const { ObjectId } = require('mongodb');

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Invoice.find().populate('user', 'name');
    res.send(orders);
  })
);

const PAGE_SIZE = 10;

orderRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const orders = await Invoice.find({ ordYes: 'Y' })
      .populate('user', 'name')
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countOrders = await Invoice.countDocuments({
      ordYes: 'Y',
    });
    res.send({
      orders,
      countOrders,
      page,
      pages: Math.ceil(countOrders / pageSize),
    });
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log(req.user)

    const custom = await Customer.findOne({ emailCus: req.user.email });
    custom.cuit = req.body.shippingAddress.cuit;
    await custom.save();



    
    const newOrder = new Invoice({
      orderItems: req.body.orderItems.map((x) => ({
        ...x,
        product: x._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      numberOfItems: req.body.numberOfItems,
      subTotal: req.body.subTotal,
      shippingPrice: req.body.shippingPrice,
      tax: req.body.tax,
      total: req.body.total,
      user: req.user._id,
      id_client: custom._id,
      id_config: req.body.id_config,
      codConNum: req.body.codConNum,
      // invNum: 23456,
      // invDat: new Date(),
      salbuy: "SALE",
      ordYes: req.body.ordYes,
      staOrd: req.body.staOrd,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: ' Orden Creada', order });
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;

    const fech1 = req.query.fech1 ? new Date(req.query.fech1) : "" ;
    const fech2 = req.query.fech2 ? new Date(req.query.fech2) : "";
    const customer = query.customer || '';
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
          
          
          
    const customerFilter =
      customer && customer !== 'all'
        ? {
          // id_client: customer
          id_client: new ObjectId(customer)
          }
        : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          // id_config: configuracion
          id_config: new ObjectId(configuracion)
          }
        : {};
    const usuarioFilter =
      usuario && usuario !== 'all'
        ? {
          // user: usuario
          user: new ObjectId(usuario)
          }
        : {};

    const producIO = await Invoice.aggregate([
      {
        $match: {
          $and: [
            fechasFilter,
            configuracionFilter,
            customerFilter,
            usuarioFilter,
            ],
        },
      },


      { $unwind: '$orderItems' },

      {
        $set: {
          titlec: '$orderItems.title',
          salio1: {
            $cond: [{ $eq: ['$salbuy', 'SALE'] }, '$orderItems.quantity', 0],
          },
          entro1: {
            $cond: [{ $eq: ['$salbuy', 'BUY'] }, '$orderItems.quantity', 0],
          },
        },
      },
      {
        $group: {
          _id: '$titlec',
          salio: { $sum: '$salio1' },
          entro: { $sum: '$entro1' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    /////////////////////////////////////////////////////////
    // const invoices = await Invoice.find();
    const ctacte = await Receipt.aggregate([
      {
        $match: {
          $and: [
            {recNum: {$gt : 0}},
            fechasRecFilter,
            configuracionFilter,
            customerFilter,
            usuarioFilter,
            ],
        },
      },

      {
        $set: {
          docDat: '$recDat',
          importeRec: '$total',
          importeRecB: '$totalBuy',
        },
      },
      {
        $unionWith: {
          coll: 'orders',
          pipeline: [
            {
              $match: {
                $and: [
                  {invNum: {$gt : 0}},
                  fechasFilter,
                  configuracionFilter,
                  customerFilter,
                  usuarioFilter,
                  ],
              },
            },
            {
              $set: {
                docDat: '$invDat',
                importeInv: '$total',
                importeInvB: '$totalBuy',
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$docDat' } },
          salesS: { $sum: '$importeInv' },
          inputsS: { $sum: '$importeRec' },
          salesB: { $sum: '$importeInvB' },
          inputsB: { $sum: '$importeRecB' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    //      res.send(ctacte);
    /////////////////////////////////////////////////////////

    const orders = await Invoice.aggregate([
      {
        $match: {
          $and: [
            {invNum: {$gt : 0}},
            { salbuy: 'SALE' },
            fechasFilter,
            configuracionFilter,
            customerFilter,
            usuarioFilter,
            ],
        },
      },


      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
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
    const customers = await Customer.aggregate([
      {
        $group: {
          _id: null,
          numCustomers: { $sum: 1 },
        },
      },
    ]);

    const dailyOrders = await Invoice.aggregate([
      {
        $match: {
          $and: [
            {invNum: {$gt : 0}},
            fechasFilter,
            configuracionFilter,
            customerFilter,
            usuarioFilter,
            ],
        },
      },

      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$invDat' } },
          orders: { $sum: 1 },
          sales: { $sum: '$total' },
          buys: { $sum: '$totalBuy' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyMoney = await Receipt.aggregate([
      {
        $match: {
          $and: [
            {recNum: {$gt : 0}},
            fechasRecFilter,
            configuracionFilter,
            customerFilter,
            usuarioFilter,
            ],
        },
      },

      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$recDat' } },
          inputs: { $sum: '$total' },
          outputs: { $sum: '$totalBuy' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $match: {
          $and: [
            configuracionFilter,
            ],
        },
      },

      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({
      producIO,
      ctacte,
      users,
      customers,
      orders,
      dailyOrders,
      dailyMoney,
      productCategories,
    });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const orders = await Invoice.find({ user: req.user._id, ordYes: 'Y' })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countOrders = await Invoice.countDocuments({ user: req.user._id, ordYes: 'Y' });

    res.send({
      orders,
      countOrders,
      page,
      pages: Math.ceil(countOrders / pageSize),
    });
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Invoice.findById(req.params.id).populate(
      'user',
      'name'
    );
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Invoice.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Invoice.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazona <amazona@mg.yourdomain.com>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Invoice.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Orden Eliminada' });
    } else {
      res.status(404).send({ message: 'Orden No Encontrada' });
    }
  })
);
module.exports = orderRouter;
