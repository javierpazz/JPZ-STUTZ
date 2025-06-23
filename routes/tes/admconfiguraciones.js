/*
    Configuraciones Routes
    /api/admin/Configuraciones
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getConfiguraciones, updateConfiguracion, createConfiguracion, getConfiguracionesBySlug, getConfiguracionesById, deleteConfiguracion } = require('../../controllers/tes/admconfiguraciones');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Configuraciones
router.get('/', getConfiguraciones );

// Obtener Configuraciones by slug
router.get('/:id', getConfiguracionesById );


// Actualizar Configuraciones
router.put(
    '/', 
    updateConfiguracion 
);

// crear Configuraciones
router.post(
    '/', 
    createConfiguracion 
);


// Eliminar Configuraciones by Id
router.delete('/:id', deleteConfiguracion );



module.exports = router;