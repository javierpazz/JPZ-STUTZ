const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Receipt = require ('../models/receiptModel.js');
const User = require ('../models/userModel.js');
const Product = require ('../models/productModel.js');
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
    const receipts = await Receipt.find({ salbuy: 'SALE' }).populate(
      'user',
      'name'
    );
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

receiptRouter.get(
  '/adminB',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const receipts = await Receipt.find({ salbuy: 'BUY' })
      .populate('user', 'name')
      .populate('supplier', 'name')
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countReceipts = await Receipt.countDocuments({ salbuy: 'BUY' });
    res.send({
      receipts,
      countReceipts,
      page,
      pages: Math.ceil(countReceipts / pageSize),
    });
  })
);

receiptRouter.get(
  '/adminS',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const receipts = await Receipt.find({ salbuy: 'SALE' })
      .populate('user', 'name')
      .populate('supplier', 'name')
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countReceipts = await Receipt.countDocuments({ salbuy: 'SALE' });
    res.send({
      receipts,
      countReceipts,
      page,
      pages: Math.ceil(countReceipts / pageSize),
    });
  })
);

receiptRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newReceipt = new Receipt({
      receiptItems: req.body.receiptItems.map((x) => ({
        ...x,
        valuee: x._id,
      })),
      itemsPrice: req.body.itemsPrice,
      totalPrice: req.body.totalPrice,
      totalBuy: req.body.totalBuy,
      user: req.body.codUse,
      supplier: req.body.codSup,
      recNum: req.body.recNum,
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
          totalSales: { $sum: '$totalPrice' },
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
          sales: { $sum: '$totalPrice' },
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
    const receipt = await Receipt.findById(req.params.id);
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
  isAdmin,
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
