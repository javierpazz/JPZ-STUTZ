const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true , required: true },
    description: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);


// const db = require('../config/config');


Category.getAll = async (result) => {
      
    try {
        const data = await Category.find();
        console.log('Id de la nueva categoria:', data);
        result(null, data);
      } catch (error) {
        let err = '';
        err = error;
        console.log('Error:', err);
        result(err, null);
      }
      };
  


Category.create = async (category, result) => {
 
  const newCategory = new Category({
    name: category.name,
    description: category.description,
    image: category.image,
    });
    let categoryRe = await newCategory.save(
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id de la nueva categoria:', res._id);
                result(null, res._id.toString());
            }
        }
    );
    }



Category.update = async (category, result) => {
    const categoryR = await Category.findById(category._id); 
    if (categoryR) {
        categoryR.name = category.name,
        categoryR.description = category.description,
        categoryR.image = category.image
        let categoryRe = await categoryR.save(
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id de la categoria actualizada:', category._id);
                result(null, category._id);
            }
        }
      );
    } else {
        console.log('problema con find');
    }
}


Category.delete = async (id, result) => {
            const category = await Category.findById(id); 
            if (category) {
              await category.remove(
                (err, res) => {
                    if (err) {
                        console.log('Error:', err);
                        result(err, null);
                    }
                    else {
                        console.log('Id de la categoria eliminada:', id);
                        result(null, id);
                    }
                }
              );
            } else {
                console.log('problema con find');
            }
    }


module.exports = Category;