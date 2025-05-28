const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const authenticate = require('../middleware/authMiddleware'); // ✅ Import authentication middleware

// ✅ Apply authentication middleware to all asset routes
router.use(authenticate);

// 🔐 Route to fetch all assets for the authenticated user
router.get('/assets', async (req, res) => {
  try {
    const { userId } = req.user;
    const assets = await Asset.findAll({ where: { userId } });
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// 🔐 Route to add a new asset or update an existing one for the authenticated user
router.post('/assets', async (req, res) => {
  try {
    const { name, ticker, quantity, price, currency } = req.body;
    const { userId } = req.user;

    if (!name || !ticker || !quantity || !price || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await Asset.findOne({ where: { ticker, currency, userId } });

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      const newAvgPrice = ((existing.quantity * existing.price) + (quantity * price)) / newQuantity;

      existing.quantity = newQuantity;
      existing.price = parseFloat(newAvgPrice.toFixed(2));
      await existing.save();

      return res.status(200).json(existing);
    } else {
      const asset = await Asset.create({ name, ticker, quantity, price, currency, userId });
      return res.status(201).json(asset);
    }

  } catch (err) {
    console.error('Error saving asset:', err);
    res.status(500).json({ error: 'Error saving asset' });
  }
});

// 🔐 Route to update an asset by ID for the authenticated user
router.put('/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, price } = req.body;
    const { userId } = req.user;

    const asset = await Asset.findOne({ where: { id, userId } });

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    asset.quantity = quantity;
    asset.price = price;

    await asset.save();

    res.json(asset);
  } catch (err) {
    console.error('Error updating asset:', err);
    res.status(500).json({ error: 'Error updating asset' });
  }
});

// 🔐 Route to delete an asset by ID for the authenticated user
router.delete('/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const asset = await Asset.findOne({ where: { id, userId } });

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    await asset.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting asset:', err);
    res.status(500).json({ error: 'Error deleting asset' });
  }
});

module.exports = router;
