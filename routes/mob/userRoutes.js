const usersController = require('../../controllers/usersController');

module.exports = (app, upload) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    // app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', { session: false }), usersController.findDeliveryMen);

    app.post('/api/mob/users/create', usersController.register);
    app.post('/api/mob/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);
    app.post('/api/mob/users/login', usersController.login);
    
    // 401 UNAUTHORIZED
    app.put('/api/mob/users/update', upload.array('image', 1), usersController.updateWithImage);
    app.put('/api/mob/users/updateWithoutImage', usersController.updateWithoutImage);
    app.put('/api/mob/users/updateNotificationToken', usersController.updateNotificationToken);


}