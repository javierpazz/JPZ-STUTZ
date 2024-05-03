const OrdersController = require('../../controllers/ordersController');
const { isAuth } = require ('../../utils');

module.exports = (app) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    
    app.get('/api/mob/orders/findByStatus/:status',isAuth, OrdersController.findByStatus);
    app.get('/api/mob/orders/findByDeliveryAndStatus/:id_delivery/:status',isAuth, OrdersController.findByDeliveryAndStatus);
    app.get('/api/mob/orders/findByClientAndStatus/:id_client/:status',isAuth, OrdersController.findByClientAndStatus);
    app.post('/api/mob/orders/create',isAuth, OrdersController.create);
    app.put('/api/mob/orders/updateToDispatched',isAuth, OrdersController.updateToDispatched);
    app.put('/api/mob/orders/updateToOnTheWay',isAuth, OrdersController.updateToOnTheWay);
    app.put('/api/mob/orders/updateToDelivered',isAuth, OrdersController.updateToDelivered);
}