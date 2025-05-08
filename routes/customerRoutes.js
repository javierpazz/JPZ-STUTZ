const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Customer = require ('../models/customerModel.js');
const Invoice = require ('../models/invoiceModel.js');
const Receipt = require ('../models/receiptModel.js');
const { isAuth, isAdmin } = require ('../utils.js');

const customerRouter = express.Router();

///////////////list
customerRouter.get('/list',
  isAuth,
  // isAdmin,
  async (req, res) => {
  const { query } = req;

  try {
    const customers = await Customer.find()
      .sort({ nameCus: 1 });


    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

  ///////////////list


customerRouter.get('/', async (req, res) => {
  const customers = await Customer.find().sort({ nameCus: 1 });
  res.send(customers);
});


customerRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newCustomer = new Customer({
      codCus: 0,
      nameCus: req.body.nameCus,
      emailCus: req.body.emailCus,
      domcomer: req.body.domcomer,
      cuit: req.body.cuit,
      coniva: req.body.coniva,
    });
    const customer = await newCustomer.save();
    res.send({
      _id: customer._id,
      nameCus: customer.nameCus,
      emailCus: customer.emailCus,
      domcomer: customer.domcomer,
      cuit: customer.cuit,
      coniva: customer.coniva,
    });
  })
);


customerRouter.post(
  '/',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newCustomer = new Customer({
      codCus: req.body.codCus,
      nameCus: req.body.nameCus,
      emailCus: req.body.emailCus,
      domcomer: req.body.domcomer,
      cuit: req.body.cuit,
      coniva: req.body.coniva,
      // codCus: '',
      // nameCus: '',
      // emailCus: '',
      // domcomer: '',
      // cuit: '',
      // coniva: '',
    });
    const customer = await newCustomer.save();
    res.send({ message: 'Customer Created', customer });
  })
);

customerRouter.put(
  '/:id',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    if (customer) {
      customer.codCus = req.body.codCus;
      customer.nameCus = req.body.nameCus;
      customer.emailCus = req.body.emailCus;
      customer.domcomer = req.body.domcomer;
      customer.cuit = req.body.cuit;
      customer.coniva = req.body.coniva;
      await customer.save();
      res.send({ message: 'Customer Updated' });
    } else {
      res.status(404).send({ message: 'Customer Not Found' });
    }
  })
);

customerRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {


    const invoices = await Invoice.findOne({id_client: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Facturas con este cliente' });
      return;
    }
    const receipts = await Receipt.findOne({id_client: req.params.id })
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Recibos con este cliente' });
      return;
    }

    const customer = await Customer.findById(req.params.id);
    if (customer) {
      await customer.remove();
      res.send({ message: 'Customer Deleted' });
    } else {
      res.status(404).send({ message: 'Customer Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

customerRouter.get(
  '/admin',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const customers = await Customer.find()
      .sort({ nameCus: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countCustomers = await Customer.countDocuments();
    res.send({
      customers,
      countCustomers,
      page,
      pages: Math.ceil(countCustomers / pageSize),
    });
  })
);

customerRouter.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (customer) {
    res.send(customer);
  } else {
    res.status(404).send({ message: 'Customer Not Found' });
  }
});

module.exports = customerRouter;
