const usersController = require('../../controllers/usersController');
const { isAuth } = require ('../../utils');

module.exports = (app, upload) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/mob/users/findDeliveryMen', isAuth, usersController.findDeliveryMen);

    app.post('/api/mob/users/create', usersController.register);
    app.post('/api/mob/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);
    app.post('/api/mob/users/login', usersController.login);
    
    // 401 UNAUTHORIZED
    app.put('/api/mob/users/update', isAuth, upload.array('image', 1), usersController.updateWithImage);
    app.put('/api/mob/users/updateWithoutImage', isAuth, usersController.updateWithoutImage);
    app.put('/api/mob/users/updateNotificationToken', isAuth, usersController.updateNotificationToken);


}