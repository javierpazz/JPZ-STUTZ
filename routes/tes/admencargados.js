/*
    Encargados Routes
    /api/admin/Encargados
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getEncargados, updateEncargado, createEncargado, getEncargadosBySlug, getEncargadosById, deleteEncargado } = require('../../controllers/tes/admencargados');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Encargados
router.get('/', getEncargados );

// Obtener Encargados by slug
router.get('/:id', getEncargadosById );


// Actualizar Encargados
router.put(
    '/', 
    updateEncargado 
);

// crear Encargados
router.post(
    '/', 
    createEncargado 
);


// Eliminar Encargados by Id
router.delete('/:id', deleteEncargado );



module.exports = router;