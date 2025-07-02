// routes/searchTicker.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET /api/search-ticker?name=Tesla&currency=USD
router.get('/', async (req, res) => {
  const { name, currency } = req.query;

  if (!name || !currency) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    if (currency === 'BRL') {
      // 🔹 Brapi (ativos brasileiros)
      const response = await fetch(`https://brapi.dev/api/quote/list?search=${name}`);
      const data = await response.json();

      if (!data?.stocks?.length) return res.json([]);

      const suggestions = data.stocks.slice(0, 8).map(stock => ({
        name: stock.name || stock.stock,
        ticker: stock.stock,
        currency: 'BRL',
      }));

      return res.json(suggestions);
    } else {
      // 🔹 Twelve Data (ativos internacionais)
      const apiKey = process.env.TWELVE_DATA_API_KEY;
      const response = await fetch(`https://api.twelvedata.com/symbol_search?symbol=${name}&apikey=${apiKey}`);
      const data = await response.json();

      if (!data?.data?.length) return res.json([]);

      const filtered = data.data.filter(stock => stock.currency === currency);

      const suggestions = filtered.slice(0, 8).map(stock => ({
        name: stock.instrument_name || stock.name || stock.symbol,
        ticker: stock.symbol,
        currency: stock.currency,
      }));

      return res.json(suggestions);
    }
  } catch (err) {
    console.error('Error fetching ticker suggestions:', err.message);
    return res.status(500).json({ error: 'Failed to fetch ticker suggestions' });
  }
});

module.exports = router;
