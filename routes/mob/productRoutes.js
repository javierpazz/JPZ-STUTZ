const productsController = require('../../controllers/productsController');
const { isAuth } = require ('../../utils');

module.exports = (app, upload) => {

    app.get('/api/mob/products/findByCategory/:id_category', isAuth, productsController.findByCategory);
    app.post('/api/mob/products/create', isAuth,  upload.array('image', 3), productsController.create);
    // app.get('/api/mob/categories/getAll', isAuth, categoriesController.getAll);
    app.put('/api/mob/products/updateWithImage', isAuth,  upload.array('image', 3), productsController.updateWithImage);
    app.put('/api/mob/products/update', isAuth, productsController.update);
    app.delete('/api/mob/products/delete/:id', isAuth, productsController.delete);

}