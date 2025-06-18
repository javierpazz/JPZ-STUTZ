/*
    Instrumento Routes
    /api/admin/Instrumentos
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getInstrumentos, updateInstrumentoDet, updateInstrumento, createInstrumento, getInstrumentosBySlug, getInstrumentosById, deleteInstrumento } = require('../../controllers/tes/adminstrumentos');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Instrumento
router.get('/', getInstrumentos );

// Obtener Instrumento by slug
router.get('/:id', getInstrumentosById );


// Actualizar Instrumento
router.put(
    '/', 
    updateInstrumento 
);

// Actualizar Instrumento
router.put(
    '/det/', 
    updateInstrumentoDet
);

// crear Instrumento
router.post(
    '/', 
    createInstrumento 
);

// Eliminar Instrumento by Id
router.delete('/:id', deleteInstrumento );



module.exports = router;