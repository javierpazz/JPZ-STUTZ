const { response } = require('express');
const Product = require('../../models/productModel');



const SHOP_CONSTANTS = {
    validGenders: ['men','women','kid','unisex'],
}



const getProducts = async( req, res = response ) => {

    
    const { gender = 'all' } = req.query;

    let condition = {};

    if ( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) {
        condition = { gender };
    }

    const products = await Product.find(condition)
                                .select('title images price inStock slug -_id')
                                .lean();


    return res.status(200).json( products );

}


const getProductBySlug = async( req, res = response ) => {
    console.log("kikipipi")

    const { slug } = req.params;
    const product = await Product.findOne({ slug })
    .populate('supplier', 'codSup name')
    .lean();
 
    if( !product ) {
        return res.status(404).json({
            message: 'Producto no encontrado'
        })
    }

    return res.json( product );


}


const getProductBySear = async( req, res = response ) => {
    console.log(req.params)
    const  term  = req.params.term;
    
    const products = await Product.find({
        $text: { $search: term }
    })
    .select('title images price inStock slug -_id')
    .lean();



    if( !products ) {
        return res.status(404).json({
            message: 'Producto no encontrado'
        })
    }

    

    return res.status(200).json( products );

}


module.exports = {
    getProducts,
    getProductBySlug,
    getProductBySear,
}