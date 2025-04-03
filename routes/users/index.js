const express = require('express');
const router = express.Router();

// Subroutes
router.use('/', require('./getAll')); // ✅ Mounts GET /all
router.use('/', require('./createUser'));
router.use('/', require('./deleteUser'));
router.use('/', require('./updateRole'));

module.exports = router;
