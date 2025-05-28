// routes/index.js
const express = require('express');
const router = express.Router();

// Import all route files
const assetRoutes = require('./assets');
const authRoutes = require('./auth');

// Mount the asset and auth routes under their respective paths
router.use('/assets', assetRoutes);
router.use('/', authRoutes);

module.exports = router;