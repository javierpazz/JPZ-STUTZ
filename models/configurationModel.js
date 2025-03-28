const mongoose = require ('mongoose');

const configurationSchema = new mongoose.Schema(
  {
    codCon: { type: Number, unique: true },
    name: { type: String, unique: true },
    domcomer: { type: String},
    cuit: { type: String},
    coniva: { type: String},
    poriva: { type: String},
    ib: { type: String},
    feciniact: { type: String},
  },
  {
    timestamps: true,
  }
);

const Configuration = mongoose.model('Configuration', configurationSchema);
// const db = require('../config/config');
module.exports = Configuration;
