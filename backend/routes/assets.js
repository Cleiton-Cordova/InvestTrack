const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const authenticate = require('../middleware/authMiddleware');
const { getBrapiData } = require('../api/brapi');
const { getTwelveData } = require('../api/twelvedata');

// ✅ Middleware: protect all asset routes
router.use(authenticate);

// ✅ GET /api/assets — Fetch all assets for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.user;
    const assets = await Asset.findAll({ where: { userId } });
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// ✅ POST /api/assets — Add or update asset
router.post('/', async (req, res) => {
  try {
    let { name, ticker, quantity, price, currency } = req.body;
    const { userId } = req.user;

    if (!name || !ticker || !quantity || !price || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    quantity = parseFloat(quantity);
    price = parseFloat(price);

    ticker = ticker.toUpperCase();
    if (currency === 'BRL' && !ticker.endsWith('.SA')) {
      ticker = `${ticker}.SA`;
    }

    const isValid = await verifyTickerExists(ticker, currency);
    console.log('[DEBUG] Ticker:', ticker, '| Currency:', currency, '| isValid:', isValid);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or unknown ticker' });
    }

    const existing = await Asset.findOne({ where: { ticker, currency, userId } });

    if (existing) {
      const totalValue = existing.quantity * existing.price + quantity * price;
      const totalQuantity = existing.quantity + quantity;
      existing.quantity = totalQuantity;
      existing.price = parseFloat((totalValue / totalQuantity).toFixed(2));
      await existing.save();
      return res.status(200).json(existing);
    } else {
      const newAsset = await Asset.create({ name, ticker, quantity, price, currency, userId });
      return res.status(201).json(newAsset);
    }
  } catch (err) {
    console.error('Error saving asset:', err);
    res.status(500).json({ error: 'Error saving asset' });
  }
});

// ✅ Helper function: validate ticker with Brapi or Twelve Data
const verifyTickerExists = async (ticker, currency) => {
  try {
    if (currency === 'BRL') {
      const data = await getBrapiData(ticker);
      return Array.isArray(data?.results) && data.results.length > 0;
    } else {
      const data = await getTwelveData(ticker);
      return data?.lastPrice !== undefined;
    }
  } catch (error) {
    console.error('Error validating ticker:', error.message);
    return false;
  }
};

module.exports = router;
