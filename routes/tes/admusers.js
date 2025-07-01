/*
    User Routes
    /api/admin/users
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../../tes/helpers/isDate');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');
const { getUsers, getUserById, updateUserAdm, updateUser, updateUserAdministracion, createUser, deleteUser } = require('../../controllers/tes/admusers');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Obtener Users
router.get('/', getUsers );

// Obtener User by slug
router.get('/:id', getUserById );

// Actualizar User
router.put(
    '/', 
    updateUserAdm 
);

// Actualizar User Rol
router.put(
    '/', 
    updateUser 
);
// Actualizar User IsActive
router.put(
    '/isActive/', 
    updateUserAdministracion
);

// crear User
router.post(
    '/', 
    createUser 
);


// Eliminar User by Id
router.delete('/:id', deleteUser );



module.exports = router;