const express = require('express');
const router = express.Router();
const getComponentModel = require('../../models/getComponentModel');
const verifyToken = require('../../middleware/auth');
const checkComponentAccess = require('../../middleware/checkComponentAccess');


router.post('/:type/add',verifyToken, checkComponentAccess, async (req, res) => {
  const { type } = req.params;

  if (!type) return res.status(400).json({ message: 'Component type is required in URL' });

  const Component = getComponentModel(type.toLowerCase());

  try {
    const exists = await Component.findOne({ itemID: req.body.itemID });
    if (exists) {
      return res.status(409).json({ message: 'Item with this ID already exists' });
    }

    const newItem = new Component(req.body);
    await newItem.save();
    res.status(201).json({ message: `Item added to '${type}' collection` });
  } catch (err) {
    console.error(`[ADD ERROR][${type}]`, err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
