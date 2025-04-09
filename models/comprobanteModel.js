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
    interno: { type: Boolean, default: false, required: true },
    numInt: { type: Number },
    codCon: { type: mongoose.Schema.Types.ObjectId, ref: 'Configuration' },

  },
  {
    timestamps: true,
  }
);
comprobanteSchema.index({ codCom: 1, codCon: 1 }, { unique: true });
const Comprobante = mongoose.model('Comprobante', comprobanteSchema);
module.exports =  Comprobante;
