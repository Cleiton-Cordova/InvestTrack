const Asset = require('../models/Asset');
const { getBrapiData } = require('../api/brapi');
const { getTwelveData } = require('../api/twelvedata');

// ✅ Helper: Validate ticker and return real data
const verifyTickerExists = async (ticker, currency) => {
  try {
    if (currency === 'BRL') {
      return await getBrapiData(ticker);
    } else {
      return await getTwelveData(ticker);
    }
  } catch (error) {
    console.error('Error validating ticker:', error.message);
    return null;
  }
};

// ✅ GET /api/assets
exports.getAssets = async (req, res) => {
  try {
    const { userId } = req.user;
    const assets = await Asset.findAll({ where: { userId } });
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

// ✅ POST /api/assets
exports.createOrUpdateAsset = async (req, res) => {
  console.log('[DEBUG] Incoming Asset Data:', req.body);

  try {
    let { name, ticker, quantity, price, currency } = req.body;
    const { userId } = req.user;

    quantity = parseFloat(quantity);
    price = parseFloat(price);
    ticker = ticker.toUpperCase();

    // ✅ Validate input
    if (
      !ticker || typeof ticker !== 'string' ||
      !currency || typeof currency !== 'string' ||
      typeof quantity !== 'number' || quantity <= 0 ||
      typeof price !== 'number' || price <= 0
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    // ✅ Normalize ticker if BRL
    if (currency === 'BRL' && !ticker.endsWith('.SA')) {
      ticker = `${ticker}.SA`;
    }

    const assetInfo = await verifyTickerExists(ticker, currency);
    console.log('[DEBUG] Ticker:', ticker, '| Currency:', currency, '| Valid:', !!assetInfo);

    if (!assetInfo) {
      return res.status(400).json({ error: 'Invalid or unknown ticker' });
    }

    if (!name || name.trim() === '') {
      name = assetInfo.name;
    }

    const existing = await Asset.findOne({ where: { ticker, currency, userId } });

    if (existing) {
      const totalValue = existing.quantity * existing.price + quantity * price;
      const totalQuantity = existing.quantity + quantity;
      existing.quantity = totalQuantity;
      existing.price = parseFloat((totalValue / totalQuantity).toFixed(2));
      existing.name = name;
      await existing.save();
      return res.status(200).json(existing);
    } else {
      const newAsset = await Asset.create({ name, ticker, quantity, price, currency, userId });
      return res.status(201).json(newAsset);
    }
  } catch (err) {
    console.error('❌ Error saving asset:', err);
    res.status(500).json({ error: 'Error saving asset' });
  }
};

// ✅ PUT /api/assets/:id
exports.updateAsset = async (req, res) => {
  try {
    const { quantity, price } = req.body;
    const { userId } = req.user;

    const asset = await Asset.findOne({ where: { id: req.params.id, userId } });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    asset.quantity = quantity;
    asset.price = price;
    await asset.save();

    res.json(asset);
  } catch (err) {
    console.error('Error updating asset:', err);
    res.status(500).json({ error: 'Failed to update asset' });
  }
};

// ✅ DELETE /api/assets/:id
exports.deleteAsset = async (req, res) => {
  try {
    const { userId } = req.user;

    const asset = await Asset.findOne({ where: { id: req.params.id, userId } });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    await asset.destroy();
    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    console.error('Error deleting asset:', err);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
};
