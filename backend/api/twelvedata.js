const fetch = require('node-fetch');

/**
 * Fetches the latest quote data for a given symbol from the Twelve Data API.
 * @param {string} symbol - The stock symbol (e.g., TSLA, AAPL).
 * @returns {Object|null} - An object containing the last price and percent change, or null if failed.
 */
const getTwelveData = async (symbol) => {
  const apiKey = process.env.TWELVE_API_KEY;
  const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('[TwelveData]', data);

    if (data.code || !data.close) {
      throw new Error('No valid data returned from Twelve Data');
    }

    return {
      lastPrice: parseFloat(data.close),
      changePercent: parseFloat(data.percent_change), // opcional
    };
  } catch (error) {
    console.error('Error fetching data from Twelve Data:', error.message);
    return null; // ✅ Retorno padrão em caso de falha
  }
};

module.exports = {
  getTwelveData,
};
