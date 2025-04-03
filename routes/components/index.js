const express = require('express');
const router = express.Router();

router.use('/', require('./add'));
router.use('/', require('./getAll'));
router.use('/', require('./updateQty'));
router.use('/', require('./updateInfo'));
router.use('/', require('./delete'));
router.use('/', require('./search'));
module.exports = router;
