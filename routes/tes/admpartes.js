/*
    Partes Routes
    /api/admin/Partes
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getPartes, updateParte, createParte, getPartesBySlug, getPartesById, deleteParte } = require('../../controllers/tes/admpartes');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Partes
router.get('/', getPartes );

// Obtener Partes by slug
router.get('/:id', getPartesById );


// Actualizar Partes
router.put(
    '/', 
    updateParte 
);

// crear Partes
router.post(
    '/', 
    createParte 
);


// Eliminar Partes by Id
router.delete('/:id', deleteParte );



module.exports = router;