const mongoose = require ('mongoose');

const configurationSchema = new mongoose.Schema(
  {
    codCon: { type: Number, required: true },
    name: { type: String, required: true },
    domcomer: { type: String, required: true },
    cuit: { type: String, required: true },
    coniva: { type: String, required: true },
    poriva: { type: String, required: true },
    ib: { type: String, required: true },
    feciniact: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Configuration = mongoose.model('Configuration', configurationSchema);
// const db = require('../config/config');
module.exports = Configuration;
