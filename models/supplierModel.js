const mongoose = require ('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    codSup: { type: String, unique: true },
    name: { type: String, unique: true },
    email: { type: String},
    domcomer: { type: String },
    cuit: { type: String },
    coniva: { type: String },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports =  Supplier;
