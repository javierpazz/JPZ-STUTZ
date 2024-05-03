const addressController = require('../../controllers/addressController');
const { isAuth } = require ('../../utils');

module.exports = (app) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    // app.get('/api/categories/getAll',  passport.authenticate('jwt', { session: false }), categoriesController.getAll);

    app.get('/api/mob/address/findByUser/:id_user', isAuth, addressController.findByUser);
    app.post('/api/mob/address/create', isAuth, addressController.create);


}