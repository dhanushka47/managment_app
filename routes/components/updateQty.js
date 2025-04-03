const express = require('express');
const router = express.Router();

// PUT /api/components/:type/update-qty/:itemID
router.put('/:type/update-qty/:itemID', async (req, res) => {
  const { type, itemID } = req.params;
  const { qty } = req.body;

  if (!qty) {
    return res.status(400).json({ message: 'Quantity is required' });
  }

  const ComponentModel = getComponentModel(type.toLowerCase());

  try {
    const updated = await ComponentModel.findOneAndUpdate(
      { itemID },
      { $set: { qty } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Quantity updated', item: updated });
  } catch (err) {
    console.error(`[UPDATE QTY ERROR][${type}]`, err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
