const express =require ('express');
const Product =require ('../models/productModel.js');
const data =require ('../data.js');
const User =require ('../models/userModel.js');
const Category =require ('../models/category.js');
const Configuration =require ('../models/configurationModel.js');
const Customer =require ('../models/customerModel.js');
const Supplier =require ('../models/supplierModel.js');
const Valuee =require ('../models/valueeModel.js');
const Comprobante =require ('../models/comprobanteModel.js');
const Encargado =require ('../models/encargadoModel.js');

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  await Category.remove({});
  const createdCategories = await Category.insertMany(data.categories);
  await Configuration.remove({});
  const createdConfiguration = await Configuration.insertMany(data.configuration);
  // sedvalCon = createdConfiguration[0]._id;
  await Customer.remove({});
  const createdCustomer = await Customer.insertMany(data.customer);
  await Supplier.remove({});
  const createdSupplier = await Supplier.insertMany(data.supplier);
  await Valuee.remove({});
  const createdValuee = await Valuee.insertMany(data.valuee);
  // await Comprobante.remove({});
  // const createdComprobante = await Comprobante.insertMany(data.comprobante);
  await Encargado.remove({});
  const createdEncargado = await Encargado.insertMany(data.encargado);
  res.send({ createdProducts, createdUsers, createdCategories });
});

module.exports = seedRouter;
