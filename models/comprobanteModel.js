const mongoose = require ('mongoose');

const comprobanteSchema = new mongoose.Schema(
  {
    codCom: { type: String, unique: true  },
    nameCom: { type: String, unique: true  },
    claCom: { type: String },
    isHaber: { type: Boolean, default: true, required: true },
    noDisc: { type: Boolean, default: true, required: true },
    toDisc: { type: Boolean, default: false, required: true },
    itDisc: { type: Boolean, default: false, required: true },
    interno: { type: Boolean, default: false, required: true },
    numInt: { type: Number },
    codComCon: { type: String, unique: true  },

  },
  {
    timestamps: true,
  }
);

const Comprobante = mongoose.model('Comprobante', comprobanteSchema);
module.exports =  Comprobante;
