const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Configuration = require ('../models/configurationModel.js');
const Invoice = require ('../models/invoiceModel.js');
const Receipt = require ('../models/receiptModel.js');
const Comprobante = require ('../models/comprobanteModel.js');
const Product = require ('../models/productModel.js');
const { isAuth, isAdmin } = require ('../utils.js');

const configurationRouter = express.Router();
///////////////list
configurationRouter.get(
  '/list',
  isAuth,
  // isAdmin,
  async (req, res) => {
  const { query } = req;

  try {
    const configurations = await Configuration.find()
      .sort({ desVal: 1 });

    res.json(configurations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

  ///////////////list

configurationRouter.get('/', async (req, res) => {
  const configurations = await Configuration.find();
  res.send(configurations);
});

configurationRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newConfiguration = new Configuration({
      codCon: '',
      name: '',
      domcomer: '',
      cuit: '',
      coniva: '',
      ib: '',
      feciniact: '',
      numIntRem: 0,
      numIntRec: 0,


    });
    const configuration = await newConfiguration.save();
    res.send({ message: 'Configuration Created', configuration });
  })
);

configurationRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const configurationId = req.params.id;
    const configuration = await Configuration.findById(configurationId);
    if (configuration) {
      configuration.codCon = req.body.codCon;
      configuration.name = req.body.name;
      configuration.domcomer = req.body.domcomer;
      configuration.cuit = req.body.cuit;
      configuration.coniva = req.body.coniva;
      configuration.ib = req.body.ib;
      configuration.feciniact = req.body.feciniact;
      configuration.numIntRem = req.body.numIntRem;
      configuration.numIntRec = req.body.numIntRec;
      await configuration.save();
      res.send({ message: 'Configuration Updated' });
    } else {
      res.status(404).send({ message: 'Configuration Not Found' });
    }
  })
);

configurationRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {

    const comprobantes = await Comprobante.findOne({codCon : req.params.id  })

    if (comprobantes) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Comprobantes con este Punto de Venta' });
      return;
    }


    const productos = await Product.findOne({id_config: req.params.id });
    if (productos) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Productos con este Punto de Venta' });
      return;
    }

    const invoices = await Invoice.findOne({id_config: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Facturas con este Punto de Venta' });
      return;
    }
    const receipts = await Receipt.findOne({id_config: req.params.id })
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Recibos con este Punto de Venta' });
      return;
    }

    const configuration = await Configuration.findById(req.params.id);
    if (configuration) {
      await configuration.remove();
      res.send({ message: 'Configuration Deleted' });
    } else {
      res.status(404).send({ message: 'Configuration Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

configurationRouter.get(
  '/admin',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const configurations = await Configuration.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countConfigurations = await Configuration.countDocuments();
    res.send({
      configurations,
      countConfigurations,
      page,
      pages: Math.ceil(countConfigurations / pageSize),
    });
  })
);

configurationRouter.get('/:id', async (req, res) => {
  const configuration = await Configuration.findById(req.params.id);
  if (configuration) {
    res.send(configuration);
  } else {
    res.status(404).send({ message: 'Configuration Not Found' });
  }
});
module.exports = configurationRouter;
