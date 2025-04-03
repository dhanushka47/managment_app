const express = require('express');
const router = express.Router();
const getComponentModel = require('../../models/getComponentModel');

// GET /api/components/:type/all?page=1&limit=10
router.get('/:type/all', async (req, res) => {
  const { type } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  try {
    const ComponentModel = getComponentModel(type.toLowerCase());

    const total = await ComponentModel.countDocuments();
    const items = await ComponentModel.find().skip(skip).limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      items
    });
  } catch (err) {
    console.error(`[GET ALL PAGINATED ERROR][${type}]`, err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
