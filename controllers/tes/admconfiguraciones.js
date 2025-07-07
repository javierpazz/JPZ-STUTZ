const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Configuration = require('../../models/configurationModel');
const Invoice = require('../../models/invoiceModel');
const Receipt = require('../../models/receiptModel');

const getConfiguraciones = async( req, res = response ) => {

    const configuraciones = await Configuration.find()
        .sort({ title: 'asc' })
        .lean();

    return res.status(200).json( configuraciones );
}

const getConfiguracionesBySlug = async( req, res = response ) => {
    const { name } = req.params;
    const configuracion = await Configuration.findOne({ name }).lean();
 
    if( !configuracion ) {
        return res.status(404).json({
            message: 'Punto Venta no encontrado'
        })
    }

    return res.json( configuracion );


}
const getConfiguracionesById = async( req, res = response ) => {
    const { id } = req.params;
    const configuracion = await Configuration.findById(id).lean();
 
    if( !configuracion ) {
        return res.status(404).json({
            message: 'Punto Venta no encontrado'
        })
    }

    return res.json( configuracion );


}


const updateConfiguracion = async(req, res) =>  {

    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del Punto Venta no es válido' });
    }
    


    try {
        
        const configuracion = await Configuration.findById(_id);
        if ( !configuracion ) {
            return res.status(400).json({ message: 'No existe un Punto Venta con ese ID' });
        }
        configuracion.codCon = req.body.codCon;
        configuracion.name = req.body.name;
        // configuracion.emailCon = req.body.emailCon;
        configuracion.domcomer = req.body.domcomer;
        configuracion.cuit = req.body.cuit;
        configuracion.coniva = req.body.coniva;
        configuracion.ib = req.body.ib;
        configuracion.feciniact = req.body.feciniact;
        configuracion.numIntRem = req.body.numIntRem;
        configuracion.numIntRec = req.body.numIntRec;
        configuracion.numIntOdp = req.body.numIntOdp;
        configuracion.numIntCaj = req.body.numIntCaj;
        configuracion.numIntMov = req.body.numIntMov;
        await configuracion.save();

        return res.status(200).json( configuracion );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createConfiguracion = async(req, res) => {

    try {
        console.log(req.body)
        const configuracionInDB = await Configuration.findOne({ name: req.body.name });
        if ( configuracionInDB ) {
            return res.status(400).json({ message: 'Ya existe un Punto Venta con ese Nombre' });
        }
        delete req.body['_id'];
        const configuracion = new Configuration( req.body );
        await configuracion.save();

        res.status(201).json( configuracion );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteConfiguracion = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del Punto Venta no es válido' });
    }
    
    const invoices = await Invoice.findOne({
            $or: [
                { id_config: req.params.id },
                { id_config2: req.params.id }
            ]
            });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Movimientos con este Punto de Venta' });
      return;
    }

    const receipts = await Receipt.findOne({id_config: req.params.id })
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Recibos con este Punto de Venta' });
      return;
    }



    try {
        
        const configuracion = await Configuration.findById(id);
        if ( !configuracion ) {
            return res.status(400).json({ message: 'No existe un Punto Venta con ese ID' });
        }
        await configuracion.delete();
        

        return res.status(200).json( configuracion );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getConfiguraciones,
    getConfiguracionesBySlug,
    getConfiguracionesById,
    updateConfiguracion,
    createConfiguracion,
    deleteConfiguracion
}



