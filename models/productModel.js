const mongoose = require ('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String },
    comment: { type: String },
    rating: { type: Number },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
    // slug: { type: String, required: true, unique: true },
    image: { type: String },
    images: [String],
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    brand: { type: String },
    category: { type: String },
    id_category: { type: String },    
    description: { type: String, required: true },
    price: { type: Number },
    countInStock: { type: Number },
    rating: { type: Number },
    numReviews: { type: Number },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

const db = require('../config/config');

Product.findByCategory = async (id_categoryR, result) => {

  try {
    const data = await Product.find({id_category : id_categoryR }); 
    console.log('Id de la nueva categoria:', data);
    result(null, data);
  } catch (error) {
    let err = '';
    err = error;
    console.log('Error:', err);
    result(err, null);
  }
  };
 
 
 Product.create = async (product, result) => {
 
     const newProduct = new Product({
         name: product.name,
         description: product.description,
         price: product.price,
         image1: product.image1,
         image2: product.image2,
         image3: product.image3,
         id_category: product.id_category,
 
         });
         let productRe = await newProduct.save(
         (err, res) => {
             if (err) {
                 console.log('Error:', err);
                 result(err, null);
             }
             else {
                 console.log('Id de la nuevo producto:', res._id.toString());
                 result(null, res._id.toString());
             }
         }
 
     )
 
 }
 
 
 Product.updateS = async (product, result) => {
 
 
   const productR = await Product.findById(product._id); 
   if (productR) {
       productR.name = product.name,
       productR.description = product.description,
       productR.price = product.price,
       productR.image1 = product.image1,
       productR.image2 = product.image2,
       productR.image3 = product.image3,
       productR.id_category = product.id_category
       try {
        let productRe = await productR.save;
        console.log('Id del producto actualizado:', product._id);
        result(null, productRe._id);
      } catch (error) {
        let err = '';
        err = error;
        console.log('Error:', err);
        result(err, null);
      }
      };
    }


 
 Product.delete = async (id, result) => {
   const product = await Product.findById(id); 
   if (product) {
     await product.remove(
 
         (err, res) => {
             if (err) {
                 console.log('Error:', err);
                 result(err, null);
             }
             else {
                 console.log('Id del producto actualizado:', product._id);
                 result(null, product._id);
             }
         }
     );
   } else {
       console.log('problema con find');
   }
 }
 
 
 
 // Product.delete = (id, result) => {
 //     const sql = `
 //     DELETE FROM
 //         products
 //     WHERE
 //         id = ?
 //     `;
 
 //     db.query(
 //         sql,
 //         [id],
 //         (err, res) => {
 //             if (err) {
 //                 console.log('Error:', err);
 //                 result(err, null);
 //             }
 //             else {
 //                 console.log('Id del producto eliminado:', id);
 //                 result(null, id);
 //             }
 //         }
 //     )
 // }
 
 module.exports = Product;