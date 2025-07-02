// routes/index.js
const express = require('express');
const router = express.Router();

const assetRoutes = require('./assets');
const authRoutes = require('./auth');
const variationRoutes = require('./variation'); 

router.use('/assets', assetRoutes);
router.use('/auth', authRoutes);
router.use('/variation', variationRoutes); 

module.exports = router;
