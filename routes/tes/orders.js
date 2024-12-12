/*
    order Routes
    /api/orders
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getOrderById, getOrdersByUs, getOrders, crearOrder, actualizarOrder, eliminarOrder } = require('../../controllers/tes/orders');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Orders 
router.get('/', getOrders );

// Obtener Orders bi Id
router.get('/getorderbyid/:id', getOrderById );


// Obtener Orders by User
router.get('/getordersbyus/:id', getOrdersByUs );


// Crear un nuevo Order
router.post(
    '/',
    crearOrder 
);

// Actualizar Order
router.put(
    '/:id', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarOrder 
);

// Borrar Order
router.delete('/:id', eliminarOrder );

module.exports = router;