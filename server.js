const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk');
require('dotenv').config();

const app = express();

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// ✅ Route Imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); // Combined users (create, delete, getAll, etc.)


const componentRoutes = require('./routes/components');
app.use('/api/components', componentRoutes);


// ✅ Route Registration
console.log('[INFO] Mounting /api/auth routes...');
app.use('/api/auth', authRoutes); // Auth routes (login, register, etc.)

console.log('[INFO] Mounting /api/user routes...');
app.use('/api/user', userRoutes); // All user-related routes (create, delete, all)

const checkoutRoutes = require('./routes/checkout');
app.use('/api/checkout', checkoutRoutes);

const clearDBRoute = require('./routes/admin/clearDB');
app.use('/api/admin', clearDBRoute);


// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(chalk.green('[SUCCESS]'), '✅ MongoDB connected successfully'))
  .catch((err) => console.error(chalk.red('[ERROR]'), '❌ MongoDB connection error:', err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(chalk.blue('[INFO]'), `🚀 Server running on port ${PORT}`);
});

// ✅ Health Test Route
app.get('/test', (req, res) => {
  console.log('[TEST] /test route hit');
  res.send('Test route is working');
});

// ✅ 404 Fallback
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});
