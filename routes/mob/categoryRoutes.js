const categoriesController = require('../../controllers/categoriesController');
const { isAuth } = require ('../../utils');

module.exports = (app, upload) => {

    app.get('/api/mob/categories/getAll', isAuth, categoriesController.getAll);
    app.post('/api/mob/categories/create', isAuth, upload.array('image', 1), categoriesController.create);
    app.put('/api/mob/categories/updateWithImage', isAuth, upload.array('image', 1), categoriesController.updateWithImage);
    app.put('/api/mob/categories/update', isAuth, categoriesController.update);
    app.delete('/api/mob/categories/delete/:id', isAuth, categoriesController.delete);

}