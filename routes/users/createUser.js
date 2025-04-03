const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const verifyToken = require('../../middleware/auth');

router.post('/create', verifyToken, async (req, res) => {
  if (req.user.role !== 'IT_administrator') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  const {
    username, password, fname, lname, birthday,
    phone, address, role, joinedDate, endDate,
    university, department, nic
  } = req.body;

  if (!username || !password || !fname || !lname || !birthday || !phone || !address || !role || !joinedDate || !nic) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      fname,
      lname,
      birthday,
      phone,
      address,
      role,
      joinedDate,
      endDate,
      university,
      department,
      nic
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (err) {
    console.error('[CREATE USER ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
