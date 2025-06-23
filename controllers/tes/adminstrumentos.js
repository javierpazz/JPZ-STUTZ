const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Instrumento = require('../../models/instrumentoModel');
const Invoice = require('../../models/invoiceModel');

const getInstrumentos = async( req, res = response ) => {

    const instrumentos = await Instrumento.find()
        .sort({ title: 'asc' })
        .lean();

    return res.status(200).json( instrumentos );
}

const getInstrumentosBySlug = async( req, res = response ) => {
    const { name } = req.params;
    const instrumento = await Instrumento.findOne({ name }).lean();
 
    if( !instrumento ) {
        return res.status(404).json({
            message: 'Instrumento no encontrado'
        })
    }

    return res.json( instrumento );


}
const getInstrumentosById = async( req, res = response ) => {
    const { id } = req.params;
    console.log(req.params)
    const instrumento = await Instrumento.findById(id).lean();
 
    if( !instrumento ) {
        return res.status(404).json({
            message: 'Instrumento no encontrado'
        })
    }

    return res.json( instrumento );


}


const updateInstrumento = async(req, res) =>  {

    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del instrumento no es válido' });
    }
    


    try {
        
        const instrumento = await Instrumento.findById(_id);
        if ( !instrumento ) {
            return res.status(400).json({ message: 'No existe un instrumento con ese ID' });
        }
        instrumento.codIns = req.body.codIns;
        instrumento.name = req.body.name;
        instrumento.orderItems = req.body.orderItems;
        await instrumento.save();
        

        return res.status(200).json( instrumento );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}
const updateInstrumentoDet = async(req, res) =>  {

    const { _id = '' } = req.body.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del instrumento no es válido' });
    }
    


    try {
        
        const instrumento = await Instrumento.findById(_id);
        if ( !instrumento ) {
            return res.status(400).json({ message: 'No existe un instrumento con ese ID' });
        }
        instrumento.orderItems = req.body.body.orderItems;
        await instrumento.save();
        

        return res.status(200).json( instrumento );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createInstrumento = async(req, res) => {
    

    try {

        const instrumentoInDB = await Instrumento.findOne({ name: req.body.name });
        if ( instrumentoInDB ) {
            return res.status(400).json({ message: 'Ya existe un instrumento con esa Descripcion' });
        }
        delete req.body['_id'];
        const instrumento = new Instrumento( req.body );
        await instrumento.save();

        res.status(201).json( instrumento );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteInstrumento = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del instrumento no es válido' });
    }
    
    const invoices = await Invoice.findOne({id_instru: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Entradas con este Instrumento' });
      return;
    }


    try {
        
        const instrumento = await Instrumento.findById(id);
        if ( !instrumento ) {
            return res.status(400).json({ message: 'No existe un instrumento con ese ID' });
        }
        await instrumento.delete();
        

        return res.status(200).json( instrumento );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getInstrumentos,
    getInstrumentosBySlug,
    getInstrumentosById,
    updateInstrumento,
    updateInstrumentoDet,
    createInstrumento,
    deleteInstrumento
}



