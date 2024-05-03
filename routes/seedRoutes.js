const express =require ('express');
const Product =require ('../models/productModel.js');
const data =require ('../data.js');
const User =require ('../models/userModel.js');
const Category =require ('../models/category.js');

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  await Category.remove({});
  const createdCategories = await Category.insertMany(data.categories);
  res.send({ createdProducts, createdUsers, createdCategories });
});

module.exports = seedRouter;
