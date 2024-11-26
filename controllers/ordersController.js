
const Order111 = require('../models/invoiceModel');



module.exports = {

    async findByStatus(req, res) {
        const status = req.params.status;
        Order.findByStatus(status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }


            const nuevoArray = data.map((d) => (
                {   id_cliente : d.id_client._id,
                    id_address : d.id_address._id,
                    id_delivery : d.id_client._id,
                    client : d.id_client,
                    delivery : d.id_client,
                    address : d.id_address,
                    products : d.orderItems,
                    status: d.status,
                    _id : d._id,
                    timestamp : d.createdAt,
                    lat : d.lat,
                    lng : d.lng
                }));

            return res.status(201).json(nuevoArray);
        });
    },
    
        

    findByDeliveryAndStatus(req, res) {
        const id_delivery = req.params.id_delivery;
        const status = req.params.status;

        Order.findByDeliveryAndStatus(id_delivery, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            const nuevoArray = data.map((d) => (
                {   id_cliente : d.id_client._id,
                    id_address : d.id_address._id,
                    id_delivery : d.id_client._id,
                    client : d.id_client,
                    delivery : d.id_delivery,
                    address : d.id_address,
                    products : d.orderItems,
                    status: d.status,
                    _id : d._id,
                    timestamp : d.createdAt,
                    lat : d.lat,
                    lng : d.lng
                }));

            return res.status(201).json(nuevoArray);
        });
    },
    
    findByClientAndStatus(req, res) {

        const id_client = req.params.id_client;
        const status = req.params.status;
    
        Order.findByClientAndStatus(id_client, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            const nuevoArray = data.map((d) => (
                {   id_cliente : d.id_client._id,
                    id_address : d.id_address._id,
                    id_delivery : d.id_client._id,
                    client : d.id_client,
                    delivery : d.id_client,
                    address : d.id_address,
                    products : d.orderItems,
                    status: d.status,
                    _id : d._id,
                    timestamp : d.createdAt,
                    lat : d.lat,
                    lng : d.lng
                }));

            return res.status(201).json(nuevoArray);
        });
    },

    async create(req, res) {

        const order = req.body;

        Order.create(order, async (err, id) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de crear la orden',
                    error: err
                });
            }


            return res.status(201).json({
                success: true,
                message: 'La orden se ha creado correctamente',
                data: `${id}` // EL ID DE LA NUEVA CATEGORIA
            });

        });

    },

    updateToDispatched(req, res) {
        const order = req.body;

        Order.updateToDispatched(order._id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    updateToOnTheWay(req, res) {
        const order = req.body;

        Order.updateToOnTheWay(order._id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    updateToDelivered(req, res) {
        const order = req.body;

        Order.updateToDelivered(order._id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },

}