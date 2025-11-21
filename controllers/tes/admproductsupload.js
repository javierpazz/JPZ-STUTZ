const { response } = require('express');
const { formidable } = require('formidable');
const { isValidObjectId } = require('mongoose');
const Product = require('../../models/productModel');
// const fs = ('fs');
const fs = require('fs');



// const saveFile = async( file ) => {
    // const saveFile = async( file: formidable.File ): Promise<string> => {
    const saveFile = async( file) => {
        console.log("1111")
        
        const data = fs.readFileSync( file.filepath );
        console.log("2")
        fs.writeFileSync(`./public/${ file.originalFilename }`, data);
        console.log("3")
        fs.unlinkSync( file.filepath ); // elimina
        return;
        // const { secure_url } = await cloudinary.uploader.upload( file.filepath );
        // return secure_url;
    
    }
    


// const parseFiles = async(req) => {

//     return new Promise( (resolve, reject) => {

//         const form = IncomingForm();
//         form.parse( req, async( err, fields, files ) => {
//             // console.log({ err, fields, files });

//             if ( err ) {
//                 return reject(err);
//             }

//             const filePath = await saveFile( files.file )
//             await saveFile( files.file )
//             resolve(true);
            
//         })

//     }) 

// }


// const parseFiles = async(req): Promise<string> => {
const parseFiles = async(req) => {

    return new Promise( (resolve, reject) => {

        // const form = new formidable.IncomingForm();
        const form = formidable({ multiples: false });
        form.parse( req, async( err, fields, files ) => {
            // console.log({ err, fields, files });

            if ( err ) {
                return reject(err);
            }

            // const filePath = await saveFile( files.file as formidable.File )
            const filePath = await saveFile( files.file)
            resolve(filePath);
        })

    }) 

}



const uploadfile = async( req, res = response ) => {
 
 
        // const imageUrl = await parseFiles(req);

        console.log(req)
        await parseFiles(req);
        
        return res.status(200).json({ message: imageUrl });
    }
    

module.exports = {
    uploadfile
}



