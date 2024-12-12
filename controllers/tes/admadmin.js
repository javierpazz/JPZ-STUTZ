const { response } = require('express');
const Product = require('../../models/productModel');
const Order = require('../../models/invoiceModel');
const User = require('../../models/userModel');

const dashboard = async( req, res = response ) => {


    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.countDocuments(),
        Order.find({ isPaid: true }).countDocuments(),
        User.find({ role: 'client' }).countDocuments(),
        Product.countDocuments(),
        Product.find({ inStock: 0 }).countDocuments(),
        Product.find({ inStock: { $lte: 10 } }).countDocuments(),
    ]);

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders: numberOfOrders - paidOrders
    })

}


module.exports = {
    dashboard
}