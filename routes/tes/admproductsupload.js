/*
    Producto Routes
    /api/admin/users
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { uploadfile } = require('../controllers/admproductsupload');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Actualizar Producto
router.post(
    '/', 
    uploadfile
);



module.exports = router;