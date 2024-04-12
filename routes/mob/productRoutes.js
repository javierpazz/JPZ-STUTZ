const productsController = require('../../controllers/productsController');

module.exports = (app, upload) => {

    app.get('/api/products/findByCategory/:id_category', productsController.findByCategory);
    app.post('/api/products/create', upload.array('image', 3), productsController.create);
    app.put('/api/products/updateWithImage', upload.array('image', 3), productsController.updateWithImage);
    app.put('/api/products/update', productsController.update);
    app.delete('/api/products/delete/:id', productsController.delete);

}