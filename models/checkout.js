const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  checkoutBy: { type: String, required: true },
  purpose: { type: String, required: true },
  date: { type: Date, default: Date.now },
  items: [
    {
      type: { type: String, required: true }, // resistor, capacitor
      itemID: { type: String, required: true },
      qty: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model('Checkout', checkoutSchema);
