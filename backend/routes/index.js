const express = require('express');
const router = express.Router();

const assetRoutes = require('./assets');
const userRoutes = require('./user');
const searchTickerRoutes = require('./searchTicker'); // search ticker routes

router.use('/assets', assetRoutes);
router.use('/user', userRoutes);
router.use('/search-ticker', searchTickerRoutes); // search ticker routes

module.exports = router;
