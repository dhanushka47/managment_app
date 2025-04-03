const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');
const mongoose = require('mongoose');
const verifyToken = require('../../middleware/auth');

router.post('/clear-db', verifyToken, async (req, res) => {
  if (req.user.role !== 'IT_administrator') {
    return res.status(403).json({ message: 'Only IT admins can clear the database' });
  }

  const archivePath = path.join(__dirname, '../../exports/db_backup.gz');
  const mongoUri = process.env.MONGO_URI;

  try {
    // Step 1: Backup
    exec(`mongodump --uri="${mongoUri}" --archive=${archivePath} --gzip`, async (err) => {
      if (err) {
        console.error('[BACKUP ERROR]', err.message);
        return res.status(500).json({ message: 'Backup failed', error: err.message });
      }

      console.log('[INFO] ✅ Backup created at', archivePath);

      // Step 2: Clear DB except users/userlogs
      await mongoose.connect(mongoUri);
      const db = mongoose.connection.db;
      const collections = await db.collections();

      const keep = ['users', 'userlogs']; // collections to keep
      for (let collection of collections) {
        if (!keep.includes(collection.collectionName)) {
          console.log(`[DROP] Clearing ${collection.collectionName}`);
          await collection.deleteMany({});
        }
      }

      // Step 3: Trigger backup download
      res.download(archivePath, 'db_backup.gz', () => {
        console.log('[INFO] 🎯 Backup sent to admin');
      });
    });

  } catch (err) {
    console.error('[CLEAR DB ERROR]', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
