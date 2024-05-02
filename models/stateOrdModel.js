const mongoose = require ('mongoose');

const stateOrdSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    note: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const StateOrd = mongoose.model('StateOrd', stateOrdSchema);
// const db = require('../config/config');

module.exports = StateOrd;
