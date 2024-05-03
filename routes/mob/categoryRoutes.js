const categoriesController = require('../../controllers/categoriesController');

module.exports = (app, upload) => {

    app.get('/api/mob/categories/getAll', categoriesController.getAll);
    app.post('/api/mob/categories/create' , upload.array('image', 1), categoriesController.create);
    app.put('/api/mob/categories/updateWithImage' , upload.array('image', 1), categoriesController.updateWithImage);
    app.put('/api/mob/categories/update', categoriesController.update);
    app.delete('/api/mob/categories/delete/:id', categoriesController.delete);

}