const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Valuee = require ('../models/valueeModel.js');
const { isAuth, isAdmin } = require ('../utils.js');
const Receipt = require('../models/receiptModel.js');

const valueeRouter = express.Router();

///////////////list
valueeRouter.get(
  '/list',
  isAuth,
  // isAdmin,
  async (req, res) => {
  const { query } = req;

  try {
    const valuees = await Valuee.find()
      .sort({ desVal: 1 });

    res.json(valuees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

  ///////////////list

valueeRouter.get('/', async (req, res) => {
  const valuees = await Valuee.find().sort({ desVal: 1 });
  res.send(valuees);
});

valueeRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newValuee = new Valuee({
      codVal: req.body.codVal,
      desVal: req.body.desVal,
    });
    const valuee = await newValuee.save();
    res.send({ message: 'Valuee Created', valuee });
  })
);

valueeRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const valueeId = req.params.id;
    const valuee = await Valuee.findById(valueeId);
    if (valuee) {
      valuee.codVal = req.body.codVal;
      valuee.desVal = req.body.desVal;
      await valuee.save();
      res.send({ message: 'Valuee Updated' });
    } else {
      res.status(404).send({ message: 'Valuee Not Found' });
    }
  })
);

valueeRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {

    const receipts = await Receipt.findOne({"receiptItems._id": req.params.id})
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Recibos con este Valor' });
      return;
    }

    const valuee = await Valuee.findById(req.params.id);
    if (valuee) {
      await valuee.remove();
      res.send({ message: 'Valuee Deleted' });
    } else {
      res.status(404).send({ message: 'Valuee Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

valueeRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const valuees = await Valuee.find()
      .sort({ desVal: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countSuppliers = await Valuee.countDocuments();
    res.send({
      valuees,
      countSuppliers,
      page,
      pages: Math.ceil(countSuppliers / pageSize),
    });
  })
);

valueeRouter.get('/:id', async (req, res) => {
  const valuee = await Valuee.findById(req.params.id);
  if (valuee) {
    res.send(valuee);
  } else {
    res.status(404).send({ message: 'Valuee Not Found' });
  }
});

module.exports = valueeRouter;
