const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const verifyToken = require('../../middleware/auth');
const allowedRoles = require('../../constants/roles');

// ✅ Update user's role (Admins only)
router.put('/update-role/:username', verifyToken, async (req, res) => {
  const targetUsername = req.params.username;
  const { newRole } = req.body;

  // 🔐 Only IT_administrator can change roles
  if (req.user.role !== 'IT_administrator') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  // ✅ Validate the new role
  if (!allowedRoles.includes(newRole)) {
    return res.status(400).json({ message: 'Invalid role provided' });
  }

  try {
    const user = await User.findOne({ username: targetUsername });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = newRole;
    await user.save();

    res.json({ message: `Role for '${targetUsername}' updated to '${newRole}'` });
  } catch (err) {
    console.error('[UPDATE ROLE ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
