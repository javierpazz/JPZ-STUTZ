const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Supplier = require ('../models/supplierModel.js');
const { isAuth, isAdmin } = require ('../utils.js');

const supplierRouter = express.Router();

supplierRouter.get('/', async (req, res) => {
  const suppliers = await Supplier.find().sort({ name: 1 });
  res.send(suppliers);
});

supplierRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newSupplier = new Supplier({
      codSup: 0,
      name: ' ',
      email: ' ',
    });
    const supplier = await newSupplier.save();
    res.send({ message: 'Supplier Created', supplier });
  })
);

supplierRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const supplierId = req.params.id;
    const supplier = await Supplier.findById(supplierId);
    if (supplier) {
      supplier.codSup = req.body.codSup;
      supplier.name = req.body.name;
      supplier.email = req.body.email;
      await supplier.save();
      res.send({ message: 'Supplier Updated' });
    } else {
      res.status(404).send({ message: 'Supplier Not Found' });
    }
  })
);

supplierRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);
    if (supplier) {
      await supplier.remove();
      res.send({ message: 'Supplier Deleted' });
    } else {
      res.status(404).send({ message: 'Supplier Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

supplierRouter.get(
  '/admin',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const suppliers = await Supplier.find()
      .sort({ name: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countSuppliers = await Supplier.countDocuments();
    res.send({
      suppliers,
      countSuppliers,
      page,
      pages: Math.ceil(countSuppliers / pageSize),
    });
  })
);

supplierRouter.get('/:id', async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (supplier) {
    res.send(supplier);
  } else {
    res.status(404).send({ message: 'Supplier Not Found' });
  }
});

module.exports = supplierRouter;
