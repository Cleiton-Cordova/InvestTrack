// api/twelvedata.js
const fetch = require('node-fetch');

const API_KEY = process.env.TWELVE_DATA_API_KEY;

const knownExchanges = [
  '',         // TSLA
  '.XETRA',   // Adidas, BASF etc.
  '.DE',      // Empresas alemãs
  '.NYSE',    // Empresas listadas na NYSE
  '.NASDAQ'   // Empresas como TSLA
];

async function getTwelveData(baseTicker) {
  for (const suffix of knownExchanges) {
    const formattedTicker = `${baseTicker}${suffix}`;
    const priceUrl = `https://api.twelvedata.com/price?symbol=${formattedTicker}&apikey=${API_KEY}`;
    const infoUrl = `https://api.twelvedata.com/symbol_search?symbol=${formattedTicker}&apikey=${API_KEY}`;

    try {
      console.log(`🔎 Trying ticker: ${formattedTicker}`);

      const response = await fetch(priceUrl);
      const data = await response.json();

      if (response.ok && data && data.price) {
        let companyName = baseTicker;

        try {
          const infoResponse = await fetch(infoUrl);
          const infoData = await infoResponse.json();
          companyName = infoData?.data?.[0]?.instrument_name || baseTicker;
        } catch (infoErr) {
          console.warn(`⚠️ Failed to fetch company name for ${formattedTicker}:`, infoErr.message);
        }

        console.log(`✅ Found price for: ${formattedTicker} | Price: ${data.price} | Name: ${companyName}`);
        return {
          lastPrice: parseFloat(data.price),
          name: companyName,
          resolvedTicker: formattedTicker
        };
      } else {
        console.warn(`❌ No price data for ${formattedTicker}:`, data?.message || 'unknown error');
      }
    } catch (err) {
      console.error(`❌ Error fetching data for ${formattedTicker}:`, err.message);
    }
  }

  console.warn(`⚠️ No valid ticker resolved for: ${baseTicker}`);
  return null;
}

module.exports = { getTwelveData };

