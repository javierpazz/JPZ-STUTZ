const { response } = require('express');
const Product = require('../../models/productModel');
const Order = require('../../models/invoiceModel');

const getOrders = async( req, res = response ) => {

    const orders = await Order.find()
                                .populate('user','name');

    res.json({
        ok: true,
        orders
    });
}

const getOrderById = async( req, res = response ) => {

    const { id } = req.params;

    // if ( !isValidObjectId(id) ){
    //     return null;
    // }

    const order = await Order.findById( id )
      .populate('id_client', 'nameCus codCus cuit coniva domcomer')
      .populate('codCom', 'nameCom codCom noDisc toDisc itDisc')
      .populate('supplier', 'name codSup cuit coniva domcomer')
      .populate('id_parte', 'name codPar')
      .populate('id_instru', 'name codIns')
      .populate('id_config' )
      .populate('id_config2', 'name codCon cuit coniva domcomer')
      .populate('user', 'name')
      .lean();
 
    if ( !order ) {
        return null;
    }

    return res.status(200).json( order );
    // return JSON.parse(JSON.stringify(order));

}


const getOrdersByUs = async( req, res = response ) => {
    console.log(req);
    const  id  = req.params.id;
    const orders = await Order.find({ user : id }).lean();
    return res.status(200).json( orders );

    // if ( !isValidObjectId(id) ){
    //     return null;
    // }

 
    if ( !orders ) {
        return null;
    }

    return res.status(200).json( orders );
    // return JSON.parse(JSON.stringify(order));

}



const crearOrder = async ( req, res = response ) => {

    /////////////////////////////////


    const { orderItems, total } = req.body;

    // Crear un arreglo con los productos que la persona quiere
    const productsIds = orderItems.map( product => product._id );

    const dbProducts = await Product.find({ _id: { $in: productsIds } });

try {

    const subTotal = orderItems.reduce( ( prev, current ) => {
        const currentPrice = dbProducts.find( prod => prod.id === current._id )?.price;
        if ( !currentPrice ) {
            throw new Error('Verifique el carrito de nuevo, producto no existe');
        }

        return (currentPrice * current.quantity) + prev
    }, 0 );

    // const taxRate = 0.10 ;
    const taxRate = orderItems.reduce( ( prev, current ) => (current.price * current.quantity * (current.porIva/100)) + prev, 0 );
    // const backendTotal = subTotal * ( taxRate + 1 );
    const backendTotal = subTotal + taxRate ;

    if ( total !== backendTotal ) {
        throw new Error('El total no cuadra con el monto');
    }

    // Todo bien hasta este punto
    const newOrder = new Order({ ...req.body,
                                 isPaid: false,
                                 user: req.uid,
                                 ordYes: "Y",
                                 staOrd: "NUEVA" });
    await newOrder.save();
    
    return res.status(201).json( newOrder );


    
} catch (error) {
    console.log(error);
    res.status(400).json({
        message: error.message || 'Revise logs del servidor'
    })
}

}
/////////////////////////////////


const actualizarOrder = async( req, res = response ) => {
    
    const orderId = req.params.id;
    const uid = req.uid;

    try {

        const order = await Order.findById( orderId );

        if ( !order ) {
            return res.status(404).json({
                ok: false,
                msg: 'Order no existe por ese id'
            });
        }

        if ( order.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este order'
            });
        }

        const nuevoOrder = {
            ...req.body,
            user: uid
        }

        const orderActualizado = await Order.findByIdAndUpdate( orderId, nuevoOrder, { new: true } );

        res.json({
            ok: true,
            order: orderActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const eliminarOrder = async( req, res = response ) => {

    const orderId = req.params.id;
    const uid = req.uid;

    try {

        const order = await Order.findById( orderId );

        if ( !order ) {
            return res.status(404).json({
                ok: false,
                msg: 'Order no existe por ese id'
            });
        }

        if ( order.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este order'
            });
        }


        await Order.findByIdAndDelete( orderId );

        res.json({ ok: true });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


module.exports = {
    getOrders,
    crearOrder,
    actualizarOrder,
    eliminarOrder,
    getOrdersByUs,
    getOrderById
}