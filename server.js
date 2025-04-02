const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());



const userDeleteRoutes = require('./routes/userDelete');
app.use('/api/user', userDeleteRoutes);


// ✅ Log that routes are being mounted
console.log('[INFO] Mounting /api/auth routes...');
app.use('/api/auth', authRoutes); // This is critical\\\



const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(chalk.green('[SUCCESS]'), '✅ MongoDB connected successfully'))
  .catch((err) => console.error(chalk.red('[ERROR]'), '❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(chalk.blue('[INFO]'), `🚀 Server running on port ${PORT}`);
});


app.get('/test', (req, res) => {
    console.log('[TEST] /test route hit');
    res.send('Test route is working');
  });

  
  
  // 404 Not Found Middleware
app.use((req, res, next) => {
    res.status(404).json({
      message: 'Route not found',
      path: req.originalUrl,
      method: req.method
    });
  });
  