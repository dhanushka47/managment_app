const express = require('express');
const router = express.Router();
const getComponentModel = require('../../models/getComponentModel');

// GET /api/components/:type/search?itemID=...&projectName=...&mpn=...
router.get('/:type/search', async (req, res) => {
  const { type } = req.params;
  const { itemID, projectName, mpn } = req.query;

  try {
    const ComponentModel = getComponentModel(type.toLowerCase());

    // Build dynamic query
    const query = {};
    if (itemID) query.itemID = itemID;
    if (projectName) query.projectName = projectName;
    if (mpn) query.mpn = mpn;

    const results = await ComponentModel.find(query);
    res.json({ count: results.length, results });
  } catch (err) {
    console.error(`[SEARCH ERROR][${type}]`, err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
