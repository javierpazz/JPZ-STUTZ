const categoriesController = require('../../controllers/categoriesController');

module.exports = (app, upload) => {

    app.get('/api/categories/getAll', categoriesController.getAll);
    app.post('/api/categories/create' , upload.array('image', 1), categoriesController.create);
    app.put('/api/categories/updateWithImage' , upload.array('image', 1), categoriesController.updateWithImage);
    app.put('/api/categories/update', categoriesController.update);
    app.delete('/api/categories/delete/:id', categoriesController.delete);

}