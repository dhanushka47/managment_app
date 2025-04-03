const express = require('express');
const router = express.Router();
const getComponentModel = require('../../models/getComponentModel');
const verifyToken = require('../../middleware/auth');

router.put('/update/:itemID', verifyToken, async (req, res) => {
  try {
    const updated = await Resistor.findOneAndUpdate(
      { itemID: req.params.itemID },
      { $set: req.body },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Item updated', item: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;
