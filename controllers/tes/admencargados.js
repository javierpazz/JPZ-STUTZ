const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Encargado = require('../../models/encargadoModel');
const Invoice = require('../../models/invoiceModel');
const Receipt = require('../../models/receiptModel');

const getEncargados = async( req, res = response ) => {

    const encargados = await Encargado.find()
        .sort({ title: 'asc' })
        .lean();

    return res.status(200).json( encargados );
}

const getEncargadosBySlug = async( req, res = response ) => {
    const { name } = req.params;
    const encargado = await Encargado.findOne({ name }).lean();
 
    if( !encargado ) {
        return res.status(404).json({
            message: 'Encargado no encontrado'
        })
    }

    return res.json( encargado );


}
const getEncargadosById = async( req, res = response ) => {
    const { id } = req.params;
    const encargado = await Encargado.findById(id).lean();
 
    if( !encargado ) {
        return res.status(404).json({
            message: 'Encargado no encontrado'
        })
    }

    return res.json( encargado );


}


const updateEncargado = async(req, res) =>  {

    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del Encargado no es válido' });
    }
    


    try {
        
        const encargado = await Encargado.findById(_id);
        if ( !encargado ) {
            return res.status(400).json({ message: 'No existe un Encargado con ese ID' });
        }
        encargado.codEnc = req.body.codEnc;
        encargado.name = req.body.name;
        await encargado.save();

        return res.status(200).json( encargado );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createEncargado = async(req, res) => {

    try {

        const encargadoInDB = await Encargado.findOne({ name: req.body.name });
        if ( encargadoInDB ) {
            return res.status(400).json({ message: 'Ya existe un Encargado con ese Nombre' });
        }
        delete req.body['_id'];
        const encargado = new Encargado( req.body );
        await encargado.save();

        res.status(201).json( encargado );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteEncargado = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del Encargado no es válido' });
    }
    


    const receipts = await Receipt.findOne({id_encarg: req.params.id })
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Recibos con este Encargado' });
      return;
    }


    try {
        
        const encargado = await Encargado.findById(id);
        if ( !encargado ) {
            return res.status(400).json({ message: 'No existe un Encargado con ese ID' });
        }
        await encargado.delete();
        

        return res.status(200).json( encargado );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getEncargados,
    getEncargadosBySlug,
    getEncargadosById,
    updateEncargado,
    createEncargado,
    deleteEncargado
}



