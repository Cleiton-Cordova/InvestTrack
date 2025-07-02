// routes/variation.js
const express = require('express');
const router = express.Router();
const { getBrapiData } = require('../api/brapi');
const { getTwelveData } = require('../api/twelvedata');

router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { currency } = req.query;

  if (!ticker || !currency) {
    return res.status(400).json({ error: 'Missing ticker or currency' });
  }

  try {
    let data;

    if (currency === 'BRL') {
      data = await getBrapiData(ticker); // PETR4.SA etc.
    } else {
      data = await getTwelveData(ticker); // TSLA, ADS, etc.
    }

    if (!data || !data.lastPrice) {
      return res.status(404).json({ error: 'Price data not found' });
    }

    res.json(data); // { lastPrice, resolvedTicker }
  } catch (err) {
    console.error('Variation fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch variation' });
  }
});

module.exports = router;
