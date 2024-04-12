const OrdersController = require('../../controllers/ordersController');

module.exports = (app) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    
    app.get('/api/orders/findByStatus/:status', OrdersController.findByStatus);
    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status', OrdersController.findByDeliveryAndStatus);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status', OrdersController.findByClientAndStatus);
    app.post('/api/orders/create', OrdersController.create);
    app.put('/api/orders/updateToDispatched', OrdersController.updateToDispatched);
    app.put('/api/orders/updateToOnTheWay', OrdersController.updateToOnTheWay);
    app.put('/api/orders/updateToDelivered', OrdersController.updateToDelivered);
}