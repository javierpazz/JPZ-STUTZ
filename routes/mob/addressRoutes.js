const addressController = require('../../controllers/addressController');

module.exports = (app) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    // app.get('/api/categories/getAll',  passport.authenticate('jwt', { session: false }), categoriesController.getAll);

    app.get('/api/address/findByUser/:id_user', addressController.findByUser);
    app.post('/api/address/create', addressController.create);


}