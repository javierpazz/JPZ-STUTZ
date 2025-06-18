/*
    Clientes Routes
    /api/admin/Clientes
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getCustomers, updateCustomer, createCustomer, getCustomersBySlug, getCustomersById, deleteCustomer } = require('../../controllers/tes/admcustomers');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Clientes
router.get('/', getCustomers );

// Obtener Clientes by slug
router.get('/:id', getCustomersById );


// Actualizar Clientes
router.put(
    '/', 
    updateCustomer 
);

// crear Clientes
router.post(
    '/', 
    createCustomer 
);


// Eliminar Clientes by Id
router.delete('/:id', deleteCustomer );



module.exports = router;