const mongoose = require ('mongoose');

const comprobanteSchema = new mongoose.Schema(
  {
    codCom: { type: Number, required: true },
    nameCom: { type: String, required: true },
    claCom: { type: String, required: true },
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
