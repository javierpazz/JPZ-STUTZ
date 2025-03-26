const mongoose = require ('mongoose');

const valueeSchema = new mongoose.Schema(
  {
    codVal: { type: String, unique: true  },
    desVal: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

const Valuee = mongoose.model('Valuee', valueeSchema);
// const db = require('../config/config');
module.exports = Valuee;
