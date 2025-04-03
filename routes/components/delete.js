const express = require('express');
const router = express.Router();
const getComponentModel = require('../../models/getComponentModel');

const verifyToken = require('../../middleware/auth');

router.delete('/:itemID', verifyToken, async (req, res) => {
  try {
    const deleted = await Resistor.findOneAndDelete({ itemID: req.params.itemID });

    if (!deleted) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

module.exports = router;
