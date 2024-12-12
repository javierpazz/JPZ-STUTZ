const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Order = require('../../models/invoiceModel');

const getOrders = async( req, res = response ) => {

    const orders = await Order.find()
        .sort({ createdAt: 'desc' })
        .populate('user', 'name email')
        .lean();

    return res.status(200).json( orders );
}



module.exports = {
    getOrders,
}



