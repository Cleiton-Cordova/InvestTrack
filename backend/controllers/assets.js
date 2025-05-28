const db = require('../config/database');
const { DataTypes } = require('sequelize');
const Asset = db.define('Asset', {
  name: DataTypes.STRING,
  ticker: DataTypes.STRING,
  quantity: DataTypes.FLOAT,
  price: DataTypes.FLOAT,
  currency: DataTypes.STRING,
});
(async () => { await db.sync(); })();
exports.createAsset = async (req, res) => {
  try {
    const { name, ticker, quantity, price, currency } = req.body;
    const asset = await Asset.create({ name, ticker, quantity, price, currency });
    res.status(201).json(asset);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
};
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll();
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};