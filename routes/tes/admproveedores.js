/*
    Proveedores Routes
    /api/admin/Proveedores
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getProveedores, updateProveedor, createProveedor, getProveedoresBySlug, getProveedoresById, deleteProveedor } = require('../../controllers/tes/admproveedores');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Proveedores
router.get('/', getProveedores );

// Obtener Proveedores by slug
router.get('/:id', getProveedoresById );


// Actualizar Proveedores
router.put(
    '/', 
    updateProveedor 
);

// crear Proveedores
router.post(
    '/', 
    createProveedor 
);


// Eliminar Proveedor by Id
router.delete('/:id', deleteProveedor );



module.exports = router;