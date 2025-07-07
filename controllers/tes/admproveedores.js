const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Supplier = require('../../models/supplierModel');
const Invoice = require('../../models/invoiceModel');
const Receipt = require('../../models/receiptModel');

const getProveedores = async( req, res = response ) => {

    const proveedoress = await Supplier.find()
        .sort({ title: 'asc' })
        .lean();

    return res.status(200).json( proveedoress );
}

const getProveedoresBySlug = async( req, res = response ) => {
    const { name } = req.params;
    const proveedores = await Supplier.findOne({ name }).lean();
 
    if( !proveedores ) {
        return res.status(404).json({
            message: 'Proveedor no encontrado'
        })
    }

    return res.json( proveedores );


}
const getProveedoresById = async( req, res = response ) => {
    const { id } = req.params;
    const proveedores = await Supplier.findById(id).lean();
 
    if( !proveedores ) {
        return res.status(404).json({
            message: 'Proveedor no encontrado'
        })
    }

    return res.json( proveedores );


}


const updateProveedor = async(req, res) =>  {

    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del Proveedor no es válido' });
    }
    


    try {
        
        const proveedores = await Supplier.findById(_id);
        if ( !proveedores ) {
            return res.status(400).json({ message: 'No existe un Proveedor con ese ID' });
        }
        proveedores.codPro = req.body.codPro;
        proveedores.name = req.body.name;
        proveedores.email = req.body.email;
        proveedores.domcomer = req.body.domcomer;
        proveedores.cuit = req.body.cuit;
        proveedores.coniva = req.body.coniva;
        await proveedores.save();

        return res.status(200).json( proveedores );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createProveedor = async(req, res) => {

    try {

        const proveedoresInDB = await Supplier.findOne({ name: req.body.name });
        if ( proveedoresInDB ) {
            return res.status(400).json({ message: 'Ya existe un Proveedor con ese Nombre' });
        }
        delete req.body['_id'];
        const proveedores = new Supplier( req.body );
        await proveedores.save();

        res.status(201).json( proveedores );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteProveedor = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del Proveedor no es válido' });
    }
    
    const invoices = await Invoice.findOne({supplier: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Movimientos con este Proveedor' });
      return;
    }

    const receipts = await Receipt.findOne({supplier: req.params.id })
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Recibos con este Proveedor' });
      return;
    }




    try {
        
        const proveedores = await Supplier.findById(id);
        if ( !proveedores ) {
            return res.status(400).json({ message: 'No existe un Proveedor con ese ID' });
        }
        await proveedores.delete();
        

        return res.status(200).json( proveedores );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getProveedores,
    getProveedoresBySlug,
    getProveedoresById,
    updateProveedor,
    createProveedor,
    deleteProveedor
}



