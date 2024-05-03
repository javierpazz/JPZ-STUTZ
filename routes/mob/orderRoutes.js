const OrdersController = require('../../controllers/ordersController');

module.exports = (app) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    
    app.get('/api/mob/orders/findByStatus/:status', OrdersController.findByStatus);
    app.get('/api/mob/orders/findByDeliveryAndStatus/:id_delivery/:status', OrdersController.findByDeliveryAndStatus);
    app.get('/api/mob/orders/findByClientAndStatus/:id_client/:status', OrdersController.findByClientAndStatus);
    app.post('/api/mob/orders/create', OrdersController.create);
    app.put('/api/mob/orders/updateToDispatched', OrdersController.updateToDispatched);
    app.put('/api/mob/orders/updateToOnTheWay', OrdersController.updateToOnTheWay);
    app.put('/api/mob/orders/updateToDelivered', OrdersController.updateToDelivered);
}