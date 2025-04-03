const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  itemID: { type: String, required: true, unique: true },
  itemType: { type: String, required: true },
  addedDate: { type: Date, required: true },
  projectName: { type: String },
  value: { type: Number },
  package: { type: String },
  description: { type: String },
  mpn: { type: String },
  qty: { type: Number, required: true },
  startQty: { type: Number, required: true },
  lowQtyNotify: { type: Number },
  storeIn: { type: String }
});

module.exports = componentSchema;
