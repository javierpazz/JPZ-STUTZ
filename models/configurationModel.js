const mongoose = require ('mongoose');

const configurationSchema = new mongoose.Schema(
  {
    codCon: { type: String, unique: true },
    name: { type: String, unique: true },
    domcomer: { type: String},
    cuit: { type: String},
    coniva: { type: String},
    ib: { type: String},
    feciniact: { type: String},
    numIntRem: { type: Number },
    numIntRec: { type: Number },
    numIntOdp: { type: Number },
    numIntCaj: { type: Number },
    numIntMov: { type: Number },

  },
  {
    timestamps: true,
  }
);

const Configuration = mongoose.model('Configuration', configurationSchema);
// const db = require('../config/config');
module.exports = Configuration;
