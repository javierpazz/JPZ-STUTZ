/*
    Valores Routes
    /api/admin/Valores
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getValores, updateValor, createValor, getValoresBySlug, getValoresById, deleteValor } = require('../../controllers/tes/admvalores');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Valores
router.get('/', getValores );

// Obtener Valores by slug
router.get('/:id', getValoresById );


// Actualizar Valores
router.put(
    '/', 
    updateValor 
);

// crear Valores
router.post(
    '/', 
    createValor 
);


// Eliminar Valores by Id
router.delete('/:id', deleteValor );



module.exports = router;