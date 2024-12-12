/*
    User Routes
    /api/admin/users
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getUsers, updateUser } = require('../../controllers/tes/admusers');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Users
router.get('/', getUsers );

// Actualizar User
router.put(
    '/', 
    updateUser 
);



module.exports = router;