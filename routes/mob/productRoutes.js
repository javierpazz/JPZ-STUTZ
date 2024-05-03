const productsController = require('../../controllers/productsController');

module.exports = (app, upload) => {

    app.get('/api/mob/products/findByCategory/:id_category', productsController.findByCategory);
    app.post('/api/mob/products/create', upload.array('image', 3), productsController.create);
    app.put('/api/mob/products/updateWithImage', upload.array('image', 3), productsController.updateWithImage);
    app.put('/api/mob/products/update', productsController.update);
    app.delete('/api/mob/products/delete/:id', productsController.delete);

}