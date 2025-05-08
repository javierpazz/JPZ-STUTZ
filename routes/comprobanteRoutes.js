const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Comprobante = require ('../models/comprobanteModel.js');
const Invoice = require ('../models/invoiceModel.js');
const { isAuth, isAdmin } = require ('../utils.js');

const comprobanteRouter = express.Router();
///////////////list
comprobanteRouter.get(
  '/list',
  isAuth,
  // isAdmin,
  async (req, res) => {
  const { query } = req;
  try {
    const comprobantes = await Comprobante.find({
      codCon : query.id_config,
      }).sort({ nameCom: 1 });

    res.json(comprobantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

  ///////////////list

comprobanteRouter.get('/', async (req, res) => {
  const { query } = req;
  const comprobantes = await Comprobante.find({
    codCon : query.id_config,
    }).sort({ nameCom: 1 });
  res.send(comprobantes);
});

comprobanteRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newComprobante = new Comprobante({
      codCom: req.body.codCom,
      nameCom: req.body.nameCom,
      claCom: req.body.claCom,
      isHaber: Boolean(req.body.isHaber),
      noDisc: Boolean(req.body.noDisc),
      toDisc: Boolean(req.body.toDisc),
      itDisc: Boolean(req.body.itDisc),
      interno: Boolean(req.body.interno),
      numInt: req.body.numInt,
      codCon: req.body.id_config,
      // codCom: '',
      // nameCom: '',
      // // claCom: '',
      // interno: 'true',
      // numInt: 0,
      // codComCon: '',
    });
    const comprobante = await newComprobante.save();
    res.send({ message: 'Comprobante Created', comprobante });
  })
);

comprobanteRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const comprobanteId = req.params.id;
    const comprobante = await Comprobante.findById(comprobanteId);
    if (comprobante) {
      comprobante.codCom = req.body.codCom;
      comprobante.nameCom = req.body.nameCom;
      comprobante.claCom = req.body.claCom;
      comprobante.isHaber = Boolean(req.body.isHaber);
      comprobante.noDisc = Boolean(req.body.noDisc);
      comprobante.toDisc = Boolean(req.body.toDisc);
      comprobante.itDisc = Boolean(req.body.itDisc);
      comprobante.interno = Boolean(req.body.interno);
      comprobante.numInt = req.body.numInt;
      comprobante.codCon = req.body.id_config;
      await comprobante.save();
      res.send({ message: 'Comprobante Updated' });
    } else {
      res.status(404).send({ message: 'Comprobante Not Found' });
    }
  })
);

comprobanteRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {


    const invoices = await Invoice.findOne({codCom: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Movimientos con este Comprobante' });
      return;
    }

    const comprobante = await Comprobante.findById(req.params.id);
    if (comprobante) {
      await comprobante.remove();
      res.send({ message: 'Comprobante Deleted' });
    } else {
      res.status(404).send({ message: 'Comprobante Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

comprobanteRouter.get(
  '/admin',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const comprobantes = await Comprobante.find({
      codCon : query.id_config,
      })
      .sort({ name: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countComprobantes = await Comprobante.countDocuments({
      codCon : query.id_config,
      });
    res.send({
      comprobantes,
      countComprobantes,
      page,
      pages: Math.ceil(countComprobantes / pageSize),
    });
  })
);

comprobanteRouter.get('/:id', async (req, res) => {
  const comprobante = await Comprobante.findById(req.params.id);
  if (comprobante) {
    res.send(comprobante);
  } else {
    res.status(404).send({ message: 'Comprobante Not Found' });
  }
});

module.exports = comprobanteRouter;
