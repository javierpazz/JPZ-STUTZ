const mongoose = require ('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    receiptItems: [
      {
        desval: { type: String, required: true },
        numval: { type: Number},
        amountval: { type: Number, required: true },
        valuee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Valuee',
          required: true,
        },
      },
    ],
    subTotal: { type: Number },
    total: { type: Number },
    totalBuy: { type: Number },
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    id_config: { type: mongoose.Schema.Types.ObjectId, ref: 'Configuration' },
    id_encarg: { type: mongoose.Schema.Types.ObjectId, ref: 'Encargado' },
    codConNum: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    recNum: { type: Number },
    recDat: { type: Date },
    cajNum: { type: Number },
    cajDat: { type: Date },
    desval: { type: String },
    ordNum: { type: Number },
    notes: { type: String },
    salbuy: { type: String },
  },
  {
    timestamps: true,
  }
);

const Receipt = mongoose.model('Receipt', receiptSchema);

// const db = require('../config/config');

module.exports = Receipt;
