const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Product = require('../../models/productModel');

const getProducts = async( req, res = response ) => {

    const products = await Product.find()
        .sort({ title: 'asc' })
        .lean();

    return res.status(200).json( products );
}

const updateProduct = async(req, res) =>  {
    
    const { _id = '', images = [] } = req.body;

    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del producto no es válido' });
    }
    
    if ( images.length < 2 ) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg


    try {
        
        const product = await Product.findById(_id);
        if ( !product ) {
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        }

        // TODO: eliminar fotos en Cloudinary
        // https://res.cloudinary.com/cursos-udemy/image/upload/v1645914028/nct31gbly4kde6cncc6i.jpg
        product.images.forEach( async(image) => {
            if ( !images.includes(image) ){
                // Borrar de cloudinary
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
                console.log({ image, fileId, extension });
                // await cloudinary.uploader.destroy( fileId );
            }
        });

        await product.updateOne( req.body );
        

        return res.status(200).json( product );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createProduct = async(req, res) => {
    
    const { images = [] } = req.body;

    if ( images.length < 2 ) {
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });
    }
    
    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg
    

    try {

        const productInDB = await Product.findOne({ slug: req.body.slug });
        if ( productInDB ) {
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
        }
        delete req.body['_id'];
        const product = new Product( req.body );
        console.log(product);
        await product.save();

        res.status(201).json( product );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}




module.exports = {
    getProducts,
    updateProduct,
    createProduct
}



