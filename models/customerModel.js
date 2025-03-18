const mongoose = require ('mongoose');

const customerSchema = new mongoose.Schema(
  {
    codCus: { type: Number, required: true },
    nameCus: { type: String, required: true, unique: true },
    emailCus: { type: String, required: true },
    domcomer: { type: String, required: true },
    cuit: { type: String, required: true },
    coniva: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
