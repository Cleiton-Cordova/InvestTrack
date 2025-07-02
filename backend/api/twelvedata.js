// api/twelvedata.js
const fetch = require('node-fetch');

const API_KEY = process.env.TWELVE_DATA_API_KEY;

const knownExchanges = [
  '',         // TSLA
  '.XETRA',   // ADS.XETRA
  '.DE',      // ADS.DE
  '.NYSE',    // NYSE stocks
  '.NASDAQ'   // NASDAQ stocks
];

async function getTwelveData(baseTicker) {
  for (const suffix of knownExchanges) {
    const formattedTicker = `${baseTicker}${suffix}`;
    const url = `https://api.twelvedata.com/price?symbol=${formattedTicker}&apikey=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data && data.price) {
        console.log(`✅ Found price for: ${formattedTicker}`);
        return { lastPrice: parseFloat(data.price), resolvedTicker: formattedTicker };
      } else {
        console.warn(`❌ No data for ${formattedTicker}:`, data?.message || 'unknown error');
      }
    } catch (err) {
      console.error(`❌ Error fetching Twelve Data for ${formattedTicker}:`, err.message);
    }
  }

  console.warn(`⚠️ No working ticker found for: ${baseTicker}`);
  return null;
}

module.exports = { getTwelveData };
