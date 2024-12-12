/*
    Event Routes
    /api/products
*/
const { Router } = require('express');
const { check } = require('express-validator');

// const { isDate } = require('../helpers/isDate');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
const { getProducts, getProductBySlug, getProductBySear } = require('../../controllers/tes/products');

const router = Router();

// Todas tienes que pasar por la validación del JWT
// router.use( validarJWT );


// Obtener productos
router.get('/', getProducts );

// Obtener productos by slug
router.get('/:slug', getProductBySlug );


// Obtener productos
router.get('/getproductsbysear/:term', getProductBySear );



module.exports = router;