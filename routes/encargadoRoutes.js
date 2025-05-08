const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Encargado = require ('../models/encargadoModel.js');
const Receipt = require ('../models/receiptModel.js');
const { isAuth, isAdmin } = require ('../utils.js');

const encargadoRouter = express.Router();
///////////////list
encargadoRouter.get(
  '/list',
    isAuth,
    // isAdmin,
  async (req, res) => {
  const { query } = req;

  try {
    const encargados = await Encargado.find()
      .sort({ name: 1 });

    res.json(encargados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

  ///////////////list
encargadoRouter.get('/', async (req, res) => {
  const encargados = await Encargado.find().sort({ name: 1 });
  res.send(encargados);
});

encargadoRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newEncargado = new Encargado({
      codEnc: '',
      name: '',
      email: '',
    });
    const encargado = await newEncargado.save();
    res.send({ message: 'Encargado Created', encargado });
  })
);

encargadoRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const encargadoId = req.params.id;
    const encargado = await Encargado.findById(encargadoId);
    if (encargado) {
      encargado.codEnc = req.body.codEnc;
      encargado.name = req.body.name;
      encargado.email = req.body.email;
      await encargado.save();
      res.send({ message: 'Encargado Updated' });
    } else {
      res.status(404).send({ message: 'Encargado Not Found' });
    }
  })
);

encargadoRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {


    const receipts = await Receipt.findOne({id_encarg: req.params.id })
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Movimientos de Caja con este Encargado' });
      return;
    }

    const encargado = await Encargado.findById(req.params.id);
    if (encargado) {
      await encargado.remove();
      res.send({ message: 'Encargado Deleted' });
    } else {
      res.status(404).send({ message: 'Encargado Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

encargadoRouter.get(
  '/admin',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const encargados = await Encargado.find()
      .sort({ name: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countEncargados = await Encargado.countDocuments();
    res.send({
      encargados,
      countEncargados,
      page,
      pages: Math.ceil(countEncargados / pageSize),
    });
  })
);

encargadoRouter.get('/:id', async (req, res) => {
  const encargado = await Encargado.findById(req.params.id);
  if (encargado) {
    res.send(encargado);
  } else {
    res.status(404).send({ message: 'Encargado Not Found' });
  }
});

module.exports = encargadoRouter;
