const express = require('express');
const router = express.Router();
const Checkout = require('../models/checkout');
const getComponentModel = require('../models/getComponentModel');

router.post('/', async (req, res) => {
  const { checkoutBy, purpose, items } = req.body;

  if (!checkoutBy || !purpose || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Reduce quantities for each item
    for (let item of items) {
      const ComponentModel = getComponentModel(item.type);
      const found = await ComponentModel.findOne({ itemID: item.itemID });

      if (!found) {
        return res.status(404).json({ message: `Item ${item.itemID} not found` });
      }

      if (found.qty < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${item.itemID}` });
      }

      found.qty -= item.qty;
      await found.save();
    }

    // Save checkout log
    const checkout = new Checkout({ checkoutBy, purpose, items });
    await checkout.save();

    res.status(201).json({ message: 'Checkout successful', checkout });
  } catch (err) {
    console.error('[CHECKOUT ERROR]', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
