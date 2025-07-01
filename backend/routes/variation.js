const express = require('express');
const router = express.Router();
const { getBrapiData } = require('../api/brapi');
const { getTwelveData } = require('../api/twelvedata');

// GET /api/variation/:ticker
// Query param: ?currency=BRL|USD|EUR
router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { currency } = req.query;

  try {
    if (!currency) {
      return res.status(400).json({ error: 'Currency is required' });
    }

    let data;

    if (currency === 'BRL') {
      const formattedTicker = ticker.toUpperCase().endsWith('.SA')
        ? ticker.toUpperCase()
        : `${ticker.toUpperCase()}.SA`;
      data = await getBrapiData(formattedTicker);
    } else {
      data = await getTwelveData(ticker.toUpperCase());
    }

    if (!data || typeof data.lastPrice !== 'number') {
      return res.status(400).json({ error: 'No variation data found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching variation:', err.message);
    res.status(500).json({ error: 'Failed to fetch variation data' });
  }
});

module.exports = router;
