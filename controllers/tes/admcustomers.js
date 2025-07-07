const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Customer = require('../../models/customerModel');
const Invoice = require('../../models/invoiceModel');
const Receipt = require('../../models/receiptModel');

const getCustomers = async( req, res = response ) => {

    const customers = await Customer.find()
        .sort({ title: 'asc' })
        .lean();

    return res.status(200).json( customers );
}

const getCustomersBySlug = async( req, res = response ) => {
    const { name } = req.params;
    const customer = await Customer.findOne({ name }).lean();
 
    if( !customer ) {
        return res.status(404).json({
            message: 'Cliente no encontrado'
        })
    }

    return res.json( customer );


}
const getCustomersById = async( req, res = response ) => {
    const { id } = req.params;
    const customer = await Customer.findById(id).lean();
 
    if( !customer ) {
        return res.status(404).json({
            message: 'Cliente no encontrado'
        })
    }

    return res.json( customer );


}


const updateCustomer = async(req, res) =>  {

    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del Cliente no es válido' });
    }
    


    try {
        
        const customer = await Customer.findById(_id);
        if ( !customer ) {
            return res.status(400).json({ message: 'No existe un Cliente con ese ID' });
        }
        customer.codCus = req.body.codCus;
        customer.nameCus = req.body.nameCus;
        customer.emailCus = req.body.emailCus;
        customer.domcomer = req.body.domcomer;
        customer.cuit = req.body.cuit;
        customer.coniva = req.body.coniva;
        await customer.save();

        return res.status(200).json( customer );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createCustomer = async(req, res) => {

    try {

        const customerInDB = await Customer.findOne({ nameCus: req.body.nameCus });
        if ( customerInDB ) {
            return res.status(400).json({ message: 'Ya existe un Cliente con ese Nombre' });
        }
        delete req.body['_id'];
        const customer = new Customer( req.body );
        await customer.save();

        res.status(201).json( customer );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteCustomer = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del Cliente no es válido' });
    }
    
    const invoices = await Invoice.findOne({id_client: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Movimientos con este Cliente' });
      return;
    }

    const receipts = await Receipt.findOne({id_client: req.params.id })
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Recibos con este Cliente' });
      return;
    }




    try {
        
        const customer = await Customer.findById(id);
        if ( !customer ) {
            return res.status(400).json({ message: 'No existe un Cliente con ese ID' });
        }
        await customer.delete();
        

        return res.status(200).json( customer );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getCustomers,
    getCustomersBySlug,
    getCustomersById,
    updateCustomer,
    createCustomer,
    deleteCustomer
}



