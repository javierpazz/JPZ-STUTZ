const mongoose = require ('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String },
        title: { type: String, required: true },
        medPro: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        size : { type: String },
        porIva : { type: Number, required: true },
        venDat : { type: String },
        observ : { type: String },
        terminado : { type: Boolean },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String },
      firstName : { type: String },
      lastName  : { type: String },
      address: { type: String },
      address2  : { type: String },
      city: { type: String },
      postalCode: { type: String },
      zip       : { type: String },
      country: { type: String },
      cuit: { type: String },
      phone     : { type: String },
      location: {
        lat: Number,
        lng: Number,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },
    paymentMethod: { type: String },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    numberOfItems: { type: Number },
    subTotal: { type: Number },
    shippingPrice: { type: Number },
    tax: { type: Number },
    total: { type: Number },
    totalBuy: { type: Number },
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    id_parte: { type: mongoose.Schema.Types.ObjectId, ref: 'Parte' },
    id_instru: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrumento' },
    libNum : { type: Number},
    folNum : { type: Number},
    asiNum : { type: Number},
    asiDat : { type: Date},
    escNum : { type: Number},
    asieNum : { type: Number},
    asieDat : { type: Date},
    terminado : { type: Boolean, default: false },
    id_config: { type: mongoose.Schema.Types.ObjectId, ref: 'Configuration' },
    id_config2: { type: mongoose.Schema.Types.ObjectId, ref: 'Configuration' },
    codConNum: { type: String },
    codCom: { type: mongoose.Schema.Types.ObjectId, ref: 'Comprobante' },
    isHaber: { type: Boolean}, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    id_delivery: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
    id_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    remNum: { type: Number },
    remDat: { type: Date },
    dueDat: { type: Date },
    movpvNum: { type: Number },
    movpvDat: { type: Date },
    invNum: { type: Number },
    invDat: { type: Date },
    recNum: { type: Number },
    recDat: { type: Date },
    desVal: { type: String },
    ordNum: { type: Number },
    notes: { type: String },
    salbuy: { type: String },
    pedcotNum: { type: Number },
    pedcotDat: { type: Date },
    cotNum: { type: Number },
    cotDat: { type: Date },
    ordYes: { type: String },
    staOrd: { type: String },
    status: { type: String},
    lat: { type: Number },
    lng: { type: Number },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ notes: 'text', orderItems: 'text' });

const Invoice = mongoose.model('Order', orderSchema);
// const db = require('../config/config');

Invoice.findByStatus = async (status, result) => {

  try {

      const data = await Invoice.find({status : status})
      .populate('id_client','name')
      .populate('id_address','address neighborhood lat lng');                
      result(null, data);

} catch (error) {
  err = error;
  console.log('Error:', err);
  result(err, null);
  }

};

Invoice.findByDeliveryAndStatus = async (id_delivery, status, result) => {

  try {

      const data = await Invoice.find({status : status, id_delivery : id_delivery})
      .populate('id_client','name')
      .populate('id_address','address neighborhood lat lng');                
      result(null, data);

} catch (error) {
  err = error;
  console.log('Error:', err);
  result(err, null);
  }

}

Invoice.findByClientAndStatus = async (id_client, status, result) => {

  try {
      const data = await Invoice.find({status : status, id_client : id_client})
      .populate('id_client','name')
      .populate('id_address','address neighborhood lat lng');                
      result(null, data);

} catch (error) {
  err = error;
  console.log('Error:', err);
  result(err, null);
  }

  
}

Invoice.create = async (order, result) => {

  const newInvoice = new Invoice({
      orderItems: order.products.map((x) => ({
        ...x,
        product: x._id,
      })),
      id_client: order.id_client,
      user: order.id_client,
      id_delivery: order.id_delivery,
      id_address: order.id_address,
      lat: order.lat,
      lng: order.lng,
      status: "PAGADO",
      timestamp: Date.now(), 
//
      // shippingAddress: order.shippingAddress,
      // subTotal: order.subTotal,
      // shippingPrice: order.shippingPrice,
      // tax: order.tax,
      // total: order.total,
      shippingAddress: {
          fullName: 'kiki',
          address: 'pasaje ant 423',
          city: 'yb',
          postalCode: '4107',
          country: 'argentina',
          location: {
            lat: '23495874985798',
            lng: '84275487598424',
            address: 'pje ant',
            name: 'tucuman',
            vicinity: 'san miguel',
            googleAddressId: '238798',
          },
        },
    

      // shippingAddress: order.shippingAddress,
      subTotal: order.subTotal,
      shippingPrice: order.shippingPrice,
      tax: order.tax,
      total: order.total,
      ordYes: 'Y',
      staOrd: "NUEVA",
//
    });
    const invoice = await newInvoice.save(
      (err, res) => {
          if (err) {
              console.log('Error:', err);
              result(err, null);
          }
          else {
              console.log('Id de la nueva orden:', res._id);
              result(null, res._id);
          }
      }

    );
  }


Invoice.updateToDispatched = async (id_order, id_delivery, result) => {
  const invoiceR = await Invoice.findById(id_order); 
  if (invoiceR) {
      invoiceR.id_delivery = id_delivery,
      invoiceR.status = 'DESPACHADO',
      invoiceR.updated_At = new Date()
      let invoiceRe = await invoiceR.save(
          (err, res) => {
              if (err) {
                  console.log('Error:', err);
                  result(err, null);
              }
              else {
                  result(null, id_order);
              }
          }
        );
  } else {
      console.log('problema con find');
  }
}

Invoice.updateToOnTheWay = async (id_order, id_delivery, result) => {
  const invoiceR = await Invoice.findById(id_order); 
  if (invoiceR) {
      // invoiceR.id_delivery = id_delivery,
      invoiceR.status = 'EN CAMINO',
      invoiceR.updated_At = new Date()
      let invoiceRe = await invoiceR.save(
          (err, res) => {
              if (err) {
                  console.log('Error:', err);
                  result(err, null);
              }
              else {
                  result(null, id_order);
              }
          }
        );
  } else {
      console.log('problema con find');
  }
}


Invoice.updateToDelivered = async (id_order, id_delivery, result) => {

  const invoiceR = await Invoice.findById(id_order); 
  if (invoiceR) {
      // invoiceR.id_delivery = id_delivery,
      invoiceR.status = 'ENTREGADO',
      invoiceR.updated_At = new Date()
      let invoiceRe = await invoiceR.save(
          (err, res) => {
              if (err) {
                  console.log('Error:', err);
                  result(err, null);
              }
              else {
                  result(null, id_order);
              }
          }
        );
  } else {
      console.log('problema con find');
  }
}


module.exports = Invoice;
