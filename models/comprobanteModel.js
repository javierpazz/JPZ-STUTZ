const mongoose = require ('mongoose');

const comprobanteSchema = new mongoose.Schema(
  {
    codCom: { type: String },
    nameCom: { type: String },
    claCom: { type: String },
    isHaber: { type: Boolean, default: true, required: true },
    noDisc: { type: Boolean, default: true, required: true },
    toDisc: { type: Boolean, default: false, required: true },
    itDisc: { type: Boolean, default: false, required: true },

  },
  {
    timestamps: true,
  }
);

const Comprobante = mongoose.model('Comprobante', comprobanteSchema);
module.exports =  Comprobante;
