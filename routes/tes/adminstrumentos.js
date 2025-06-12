/*
    User Routes
    /api/admin/users
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getInstrumentos, updateInstrumento, createInstrumento, getInstrumentosBySlug } = require('../../controllers/tes/adminstrumentos');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Users
router.get('/', getInstrumentos );

// Obtener productos by slug
router.get('/:name', getInstrumentosBySlug );


// Actualizar User
router.put(
    '/', 
    updateInstrumento 
);

// crear User
router.post(
    '/', 
    createInstrumento 
);




module.exports = router;