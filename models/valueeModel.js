const mongoose = require ('mongoose');

const valueeSchema = new mongoose.Schema(
  {
    codVal: { type: Number, required: true },
    desVal: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Valuee = mongoose.model('Valuee', valueeSchema);
// const db = require('../config/config');
module.exports = Valuee;
