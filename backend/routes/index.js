// routes/index.js
const express = require('express');
const router = express.Router();

const assetRoutes = require('./assets');
const authRoutes = require('./auth');
const variationRoutes = require('./variation'); 
const searchTickerRoutes = require('./searchTicker'); // ✅ necessário para autocomplete funcionar

router.use('/assets', assetRoutes);
router.use('/auth', authRoutes);
router.use('/variation', variationRoutes); 
router.use('/search-ticker', searchTickerRoutes); // ✅ ativa a rota

module.exports = router;
