const mercadoPagoController = require('../../controllers/mercadoPagoController');
const { isAuth } = require ('../../utils');

module.exports = (app) => {

    app.post('/api/mob/payments/create', isAuth, mercadoPagoController.createPayment);

}