const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const chalk = require('chalk');
const allowedRoles = require('../constants/roles');
const jwt = require('jsonwebtoken');

const verifyToken = require('../middleware/auth');


// 🧪 Simple ping test route
router.get('/ping', (req, res) => {
  console.log('[PING] /api/auth/ping hit');
  res.send('pong');
});

// 🛡 Register Route
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  console.log(`[REGISTER] Received request → Username: ${username}, Role: ${role}`);

  if (!username || !password || !role) {
    console.log('[ERROR] Missing required fields');
    return res.status(400).json({ message: 'Username, password, and role are required' });
  }

  if (!allowedRoles.includes(role)) {
    console.log('[ERROR] Invalid role received:', role);
    return res.status(403).json({ message: 'Invalid role' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`[REGISTER] Username '${username}' already exists`);
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    console.log(chalk.green('[SUCCESS]'), `User '${username}' registered as '${role}'`);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('[REGISTER ERROR]', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});


// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`[LOGIN] Attempt by '${username}'`);
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.log(`[LOGIN] User '${username}' not found`);
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`[LOGIN] Invalid password for '${username}'`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '5h' }
      );
  
      console.log(`[LOGIN] Success for '${username}'`);
      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (err) {
      console.error('[LOGIN ERROR]', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  // ✅ Protected Route Example
router.get('/me', verifyToken, (req, res) => {
    res.json({
      message: 'Token verified successfully!',
      user: req.user
    });
  });


 // One-time admin registration route (temporary use only)
router.post('/register-admin', async (req, res) => {
    const { username, password } = req.body;
  
    // Basic check
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
  
    try {
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(409).json({ message: 'Username already exists' });
      }
  
      const hashed = await bcrypt.hash(password, 10);
  
      const admin = new User({
        username,
        password: hashed,
        fname: "IT",
        lname: "Admin",
        birthday: new Date("1990-01-01"),
        phone: "0770000000",
        address: "Admin HQ",
        role: "IT_administrator",
        joinedDate: new Date(),
        endDate: null,
        university: "UOR",
        department: "IT",
        nic: "900000001V"
      });
  
      await admin.save();
      res.status(201).json({ message: "Admin created successfully" });
    } catch (err) {
      console.error('[REGISTER-ADMIN ERROR]', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  


module.exports = router;






