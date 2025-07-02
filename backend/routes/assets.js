const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const assetController = require('../controllers/assets');

// ✅ Middleware global: protects all routes
router.use(authenticate);

// ✅ Routes
router.get('/', assetController.getAssets);
router.post('/', assetController.createOrUpdateAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
