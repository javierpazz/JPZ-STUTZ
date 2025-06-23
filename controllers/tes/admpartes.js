const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Parte = require('../../models/parteModel');
const Invoice = require('../../models/invoiceModel');

const getPartes = async( req, res = response ) => {

    const partes = await Parte.find()
        .sort({ title: 'asc' })
        .lean();

    return res.status(200).json( partes );
}

const getPartesBySlug = async( req, res = response ) => {
    const { name } = req.params;
    const parte = await Parte.findOne({ name }).lean();
 
    if( !parte ) {
        return res.status(404).json({
            message: 'Parte no encontrado'
        })
    }

    return res.json( parte );


}
const getPartesById = async( req, res = response ) => {
    const { id } = req.params;
    const parte = await Parte.findById(id).lean();
 
    if( !parte ) {
        return res.status(404).json({
            message: 'Parte no encontrado'
        })
    }

    return res.json( parte );


}


const updateParte = async(req, res) =>  {

    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del Parte no es válido' });
    }
    


    try {
        
        const parte = await Parte.findById(_id);
        if ( !parte ) {
            return res.status(400).json({ message: 'No existe un Parte con ese ID' });
        }
        parte.codPar = req.body.codPar;
        parte.name = req.body.name;
        parte.email = req.body.email;
        parte.domcomer = req.body.domcomer;
        parte.cuit = req.body.cuit;
        parte.coniva = req.body.coniva;
        parte.ib = req.body.ib;
        await parte.save();

        return res.status(200).json( parte );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createParte = async(req, res) => {

    try {

        const parteInDB = await Parte.findOne({ name: req.body.name });
        if ( parteInDB ) {
            return res.status(400).json({ message: 'Ya existe un Parte con ese Nombre' });
        }
        delete req.body['_id'];
        const parte = new Parte( req.body );
        await parte.save();

        res.status(201).json( parte );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteParte = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del Parte no es válido' });
    }
    
    const invoices = await Invoice.findOne({id_parte: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Entradas con este Parte' });
      return;
    }


    try {
        
        const parte = await Parte.findById(id);
        if ( !parte ) {
            return res.status(400).json({ message: 'No existe un Parte con ese ID' });
        }
        await parte.delete();
        

        return res.status(200).json( parte );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getPartes,
    getPartesBySlug,
    getPartesById,
    updateParte,
    createParte,
    deleteParte
}



