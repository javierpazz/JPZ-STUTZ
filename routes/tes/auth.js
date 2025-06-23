/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../tes/middlewares/validar-campos');
const { crearUsuario, loginUsuario, loginUsuarioAdm, revalidarToken } = require('../../controllers/tes/auth');
const { validarJWT } = require('../../tes/middlewares/validar-jwt');


const router = Router();



router.post(
    '/register', 
    [ // middlewares
        check('name', 'El nombre es obligatorio').isLength({ min: 2 }).not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario 
);

router.post(
    '/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario 
);

router.post(
    '/loginadm',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuarioAdm
);


router.get('/validate-token',
 validarJWT ,
 revalidarToken );


module.exports = router;