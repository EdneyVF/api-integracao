const express = require('express');
const router = express.Router();

const reportRoutes = require('./reportRoutes');

router.use('/api/reports', reportRoutes);

module.exports = router; 