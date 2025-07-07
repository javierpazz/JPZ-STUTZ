const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Comprobante = require('../../models/comprobanteModel');
const Invoice = require('../../models/invoiceModel');

const getComprobantes = async( req, res = response ) => {
    const comprobantes = await Comprobante.find({codCon : req.query.id_config})
        .sort({ nameCom: 'asc' })
        .lean();

    return res.status(200).json( comprobantes );
}

const getComprobantesBySlug = async( req, res = response ) => {
    const { name } = req.params;
    const comprobante = await Comprobante.findOne({ name }).lean();
 
    if( !comprobante ) {
        return res.status(404).json({
            message: 'Comprobante no encontrado'
        })
    }

    return res.json( comprobante );


}
const getComprobantesById = async( req, res = response ) => {
    const { id } = req.params;
    console.log(req.params)
    const comprobante = await Comprobante.findById(id).lean();
 
    if( !comprobante ) {
        return res.status(404).json({
            message: 'Comprobante no encontrado'
        })
    }

    return res.json( comprobante );


}


const updateComprobante = async(req, res) =>  {
    console.log("koko")
    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del comprobante no es válido' });
    }
    


    try {
        
        const comprobante = await Comprobante.findById(_id);
        if ( !comprobante ) {
            return res.status(400).json({ message: 'No existe un comprobante con ese ID' });
        }
        comprobante.codCom = req.body.codCom;
        comprobante.nameCom = req.body.nameCom;
        comprobante.isHaber = req.body.isHaber;
        comprobante.noDisc = req.body.noDisc;
        comprobante.toDisc = req.body.toDisc;
        comprobante.itDisc = req.body.itDisc;
        comprobante.interno = req.body.interno;
        comprobante.numInt = req.body.numInt;
        comprobante.codCon = comprobante.codCon;
        await comprobante.save();
        

        return res.status(200).json( comprobante );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}
const updateComprobanteDet = async(req, res) =>  {

    const { _id = '' } = req.body.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del comprobante no es válido' });
    }
    


    try {
        
        const comprobante = await Comprobante.findById(_id);
        if ( !comprobante ) {
            return res.status(400).json({ message: 'No existe un comprobante con ese ID' });
        }
        comprobante.orderItems = req.body.body.orderItems;
        await comprobante.save();
        

        return res.status(200).json( comprobante );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createComprobante = async(req, res) => {
    

    try {

        const comprobanteInDB = await Comprobante.findOne({ nameCom: req.body.nameCom });
        if ( comprobanteInDB ) {
            return res.status(400).json({ message: 'Ya existe un comprobante con esa Descripcion' });
        }
        delete req.body['_id'];
        const comprobante = new Comprobante( req.body );
        await comprobante.save();

        res.status(201).json( comprobante );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteComprobante = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del comprobante no es válido' });
    }
    
    const invoices = await Invoice.findOne({codCom: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Movimientos con este Comprobante' });
      return;
    }


    try {
        
        const comprobante = await Comprobante.findById(id);
        if ( !comprobante ) {
            return res.status(400).json({ message: 'No existe un comprobante con ese ID' });
        }
        await comprobante.delete();
        

        return res.status(200).json( comprobante );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getComprobantes,
    getComprobantesBySlug,
    getComprobantesById,
    updateComprobante,
    updateComprobanteDet,
    createComprobante,
    deleteComprobante
}



