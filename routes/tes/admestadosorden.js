/*
    EstadosOrden Routes
    /api/admin/EstadosOrden
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getEstadosOrden, updateEstadoOrden, createEstadoOrden, getEstadosOrdenBySlug, getEstadosOrdenById, deleteEstadoOrden } = require('../../controllers/tes/admestadosorden');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener EstadosOrden
router.get('/', getEstadosOrden );

// Obtener EstadosOrden by slug
router.get('/:id', getEstadosOrdenById );


// Actualizar EstadosOrden
router.put(
    '/', 
    updateEstadoOrden 
);

// crear EstadosOrden
router.post(
    '/', 
    createEstadoOrden 
);


// Eliminar EstadosOrden by Id
router.delete('/:id', deleteEstadoOrden );



module.exports = router;