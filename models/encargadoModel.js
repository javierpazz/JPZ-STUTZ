const mongoose = require ('mongoose');

const encargadoSchema = new mongoose.Schema(
  {
    codEnc: { type: String, unique: true },
    name: { type: String, unique: true },
    email: { type: String},
  },
  {
    timestamps: true,
  }
);

const Encargado = mongoose.model('Encargado', encargadoSchema);
module.exports =  Encargado;
