const mongoose = require ('mongoose');

const customerSchema = new mongoose.Schema(
  {
    codCus: { type: String, unique: true  },
    nameCus: { type: String, unique: true },
    emailCus: { type: String },
    domcomer: { type: String },
    cuit: { type: String },
    coniva: { type: String },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
