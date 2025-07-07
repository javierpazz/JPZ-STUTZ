const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const EstadoOrden = require('../../models/stateOrdModel');
const Invoice = require('../../models/invoiceModel');

const getEstadosOrden = async( req, res = response ) => {

    const encargados = await EstadoOrden.find()
        .sort({ title: 'asc' })
        .lean();

    return res.status(200).json( encargados );
}

const getEstadosOrdenBySlug = async( req, res = response ) => {
    const { name } = req.params;
    const encargado = await EstadoOrden.findOne({ name }).lean();
 
    if( !encargado ) {
        return res.status(404).json({
            message: 'Estado Orden no encontrado'
        })
    }

    return res.json( encargado );


}
const getEstadosOrdenById = async( req, res = response ) => {
    const { id } = req.params;
    const encargado = await EstadoOrden.findById(id).lean();
 
    if( !encargado ) {
        return res.status(404).json({
            message: 'Estado Orden no encontrado'
        })
    }

    return res.json( encargado );


}


const updateEstadoOrden = async(req, res) =>  {

    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del Estado Orden no es válido' });
    }
    


    try {
        
        const encargado = await EstadoOrden.findById(_id);
        if ( !encargado ) {
            return res.status(400).json({ message: 'No existe un Estado Orden con ese ID' });
        }
        encargado.name = req.body.name;
        encargado.note = req.body.note;
        await encargado.save();

        return res.status(200).json( encargado );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createEstadoOrden = async(req, res) => {

    try {

        const encargadoInDB = await EstadoOrden.findOne({ name: req.body.name });
        if ( encargadoInDB ) {
            return res.status(400).json({ message: 'Ya existe un Estado Orden con ese Nombre' });
        }
        delete req.body['_id'];
        const encargado = new EstadoOrden( req.body );
        await encargado.save();

        res.status(201).json( encargado );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteEstadoOrden = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del Estado Orden no es válido' });
    }
    
    const invoices = await Invoice.findOne({id_estado: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Movimientos con este Estado' });
      return;
    }




    try {
        
        const encargado = await EstadoOrden.findById(id);
        if ( !encargado ) {
            return res.status(400).json({ message: 'No existe un Estado Orden con ese ID' });
        }
        await encargado.delete();
        

        return res.status(200).json( encargado );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getEstadosOrden,
    getEstadosOrdenBySlug,
    getEstadosOrdenById,
    updateEstadoOrden,
    createEstadoOrden,
    deleteEstadoOrden
}



