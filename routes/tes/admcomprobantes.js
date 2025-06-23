/*
    Comprobante Routes
    /api/admin/Comprobantes
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getComprobantes, updateComprobanteDet, updateComprobante, createComprobante, getComprobantesBySlug, getComprobantesById, deleteComprobante } = require('../../controllers/tes/admcomprobantes');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Comprobante
router.get('/', getComprobantes );

// Obtener Comprobante by slug
router.get('/:id', getComprobantesById );


// Actualizar Comprobante
router.put(
    '/', 
    updateComprobante 
);

// Actualizar Comprobante
router.put(
    '/det/', 
    updateComprobanteDet
);

// crear Comprobante
router.post(
    '/', 
    createComprobante 
);

// Eliminar Comprobante by Id
router.delete('/:id', deleteComprobante );



module.exports = router;