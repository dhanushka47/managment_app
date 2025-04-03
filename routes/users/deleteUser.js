const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const verifyToken = require('../../middleware/auth');

router.delete('/delete/:username', verifyToken, async (req, res) => {
  if (req.user.role !== 'IT_administrator') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  try {
    const user = await User.findOneAndDelete({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `User '${req.params.username}' deleted successfully` });
  } catch (err) {
    console.error('[DELETE USER ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
