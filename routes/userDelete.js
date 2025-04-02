// routes/userDelete.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/auth');


// DELETE user by username (Only IT_administrator)
router.delete('/delete/:username', verifyToken, async (req, res) => {
  const usernameToDelete = req.params.username;

  if (req.user.role !== 'IT_administrator') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ username: usernameToDelete });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `User '${usernameToDelete}' deleted successfully` });
  } catch (err) {
    console.error('[USER DELETE ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
