const express = require('express');
const router = express.Router();
const User = require('../../models/user'); // Adjust path if needed

// ✅ GET /api/user/all
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('[GET USERS ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
