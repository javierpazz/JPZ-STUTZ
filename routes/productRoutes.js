const express = require ('express');
const expressAsyncHandler = require ('express-async-handler');
const Product = require ('../models/productModel.js');
const Invoice = require ('../models/invoiceModel.js');
const { isAuth, isAdmin } = require ('../utils.js');
const { ObjectId } = require('mongodb');

const productRouter = express.Router();


///////////////list
productRouter.get(
  '/list',
  isAuth,
  // isAdmin,
  async (req, res) => {
  const { query } = req;
  const configuracion = query.configuracion || '';

  try {
    const products = await Product.find(
      {id_config: new ObjectId(configuracion)}
    )
      .populate('supplier', 'name') // trae solo supplier.name
      .sort({ category: 1, codPro: 1 });

    const result = products.map(prod => ({
      codigoPro: prod.codigoPro,
      codPro: prod.codPro,
      title: prod.title,
      supplier: prod.supplier?.name || 'N/A',
      category: prod.category,
      price: prod.price?.toFixed(2),
      priceBuy: prod.priceBuy?.toFixed(2),
      inStock: prod.inStock?.toFixed(2),
      minStock: prod.minStock?.toFixed(2),
      porIva: prod.porIva,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

  ///////////////list


productRouter.get('/', async (req, res) => {
  const { query } = req;
    const configuracion = query.configuracion || '';
    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: new ObjectId(configuracion)
          }
        : {};



    // const products = await Product.find().sort({ name: +1 });
  const products = await Product.find(
    // {id_config : query.id_config}
      configuracionFilter,
    )
    .sort({ name: +1 }
    );
  res.send(products);
});

productRouter.get('/xpv', async (req, res) => {
  const { query } = req;
  const products = await Product.find({id_config : query.id_config}).sort({ name: +1 });
  res.send(products);
});



productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      codPro: req.body.codPro,
      codigoPro: req.body.codigoPro,
      title: req.body.title,
      medPro: req.body.medPro,
      slug: req.body.slug,
      price: req.body.price,
      priceBuy: req.body.priceBuy,
      image: req.body.image,
      images: req.body.images,
      id_config: req.body.id_config,
      category: req.body.category,
      brand: req.body.brand,
      inStock: req.body.inStock,
      minStock: req.body.minStock,
      porIva: req.body.porIva,
      description: req.body.description,
      supplier: req.body.codSup,

      // codPro: 'Codigo Barra',
      // codigoPro: 'Codigo Propio',
      // title: 'Nombre',
      // slug: '',
      // // image: '/images/p1.jpg',
      // price: 0,
      // category: 'Categoria',
      // brand: 'Marca',
      // inStock: 0,
      // minStock: 0,
      // porIva: 0,
      // rating: 0,
      // numReviews: 0,
      // description: 'Descripcion',
      // sizes: ['XS'],
      // images: [],
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

productRouter.put(
  '/aumpre',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
  
  
    const porcen = req.query.porcen || '';
    const codProd2 = req.query.codProd2 || '';
    const codProd1 = req.query.codProd1 || '';
    const supplier = req.query.supplier || '';
    const category = req.query.category || '';
    const configuracion = req.query.configuracion || '';

    const productsFilter =
    !codProd1 && !codProd2 ? {}
  : !codProd1 && codProd2 ? {
                codigoPro: {
                  $lte: codProd2,
                },
              }
  : codProd1 && !codProd2 ? {
                codigoPro: {
                  $gte: codProd1,
                },
              }
  :                   {
                codigoPro: {
                  $gte: codProd1,
                  $lte: codProd2,
                },
              };

        const supplierFilter =
              supplier && supplier !== 'all'
                ? {
                  supplier: new ObjectId(supplier)
                  }
                : {};
        const categoryFilter =
              category && category !== 'all'
                ? {
                  category: category
                  }
                : {};
        

    try {
      const products = await Product.find({
        // codPro: { $gte: codProd1, $lte: codProd2 },
        ...productsFilter,
        ...supplierFilter,
        ...categoryFilter,
        id_config : new ObjectId(configuracion) 
      });
      const updates = await Promise.all(
        products.map(async (product) => {
          product.price = parseFloat((product.price * (1 + porcen / 100)).toFixed(2));
          return await product.save();
        })
      );
      res.send({ message: 'Product Updated' });
    } catch (error) {
      console.error('Error al actualizar precios por codPro:', error);
      result(error, null);
    }

  })
);

productRouter.put(
  '/dispre',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const porcen = req.query.porcen || '';
    const codProd2 = req.query.codProd2 || '';
    const codProd1 = req.query.codProd1 || '';
    const supplier = req.query.supplier || '';
    const category = req.query.category || '';
    const configuracion = req.query.configuracion || '';

    const productsFilter =
    !codProd1 && !codProd2 ? {}
  : !codProd1 && codProd2 ? {
                codigoPro: {
                  $lte: codProd2,
                },
              }
  : codProd1 && !codProd2 ? {
                codigoPro: {
                  $gte: codProd1,
                },
              }
  :                   {
                codigoPro: {
                  $gte: codProd1,
                  $lte: codProd2,
                },
              };

        const supplierFilter =
              supplier && supplier !== 'all'
                ? {
                  supplier: new ObjectId(supplier)
                  }
                : {};
        const categoryFilter =
              category && category !== 'all'
                ? {
                  category: category
                  }
                : {};
        

    try {
      const products = await Product.find({
        // codPro: { $gte: codProd1, $lte: codProd2 },
        ...productsFilter,
        ...supplierFilter,
        ...categoryFilter,
        id_config : new ObjectId(configuracion) 
      });
      const updates = await Promise.all(
        products.map(async (product) => {
          product.price = parseFloat((product.price / (1 + porcen / 100)).toFixed(2));
          return await product.save();
        })
      );
      res.send({ message: 'Product Updated' });
    } catch (error) {
      console.error('Error al actualizar precios por codPro:', error);
      result(error, null);
    }

  })
);



productRouter.put(
  '/upstock/:id',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.inStock = product.inStock + +req.body.quantitys;
      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.put(
  '/downstock/:id',
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.inStock = product.inStock - +req.body.quantitys;
      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.codPro = req.body.codPro;
      product.codigoPro = req.body.codigoPro;
      product.title = req.body.title;
      product.medPro = req.body.medPro;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.priceBuy = req.body.priceBuy,
      product.image = req.body.image;
      product.images = req.body.images;
      // product.id_config = req.body.id_config,
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.inStock = req.body.inStock;
      product.minStock = req.body.minStock;
      product.porIva = req.body.porIva;
      product.description = req.body.description;
      product.supplier = req.body.codSup;
      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {

    const invoices = await Invoice.findOne({ "orderItems._id": req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Movimientos con este Producto' });
      return;
    }

    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

const PAGE_SIZE = 10;

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const products = await Product.find({id_config : query.id_config})
      .populate('supplier', 'name')
      .sort({ title: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments({id_config : query.id_config});
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/admin/tes',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const products = await Product.find({id_config : query.id_config})
      .populate('supplier', 'name')
      .sort({ title: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments({id_config : query.id_config});
    // return res.status(200).json( products );
    res.send(products);
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const configuration = query.id_config || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            title: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    const configuracionFilter =
      configuration && configuration !== 'all'
        ? {
          id_config : configuration
        }
        : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...configuracionFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...configuracionFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    console.log(req.query)
        const configuracion = req.query.configuracion || '';
    const configuracionFilter =
      configuracion && configuracion !== 'all'
        ? {
          id_config: new ObjectId(configuracion)
          }
        : {};

    const categories = await Product.find(
            configuracionFilter,
    ).distinct('category');
    res.send(categories);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  .populate('supplier', 'codSup name');
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
module.exports = productRouter;
