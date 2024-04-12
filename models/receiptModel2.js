import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema(
  {
    receiptItems: [
      {
        desval: { type: String, required: true },
        numval: { type: Number, required: true },
        amount: { type: Number, required: true },
        valuee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Valuee',
          required: true,
        },
      },
    ],
    itemsPrice: { type: Number },
    totalPrice: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    recNum: { type: Number },
    recDat: { type: Date },
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
export default Receipt;
