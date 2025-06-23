const mongoose = require ('mongoose');

const parteSchema = new mongoose.Schema(
  {
    codPar: { type: String, unique: true  },
    name: { type: String, unique: true },
    email: { type: String },
    domcomer: { type: String },
    cuit: { type: String },
    coniva: { type: String },
  },
  {
    timestamps: true,
  }
);

const Parte = mongoose.model('Parte', parteSchema);
module.exports = Parte;
