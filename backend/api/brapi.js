const fetch = require('node-fetch');

const getBrapiData = async (ticker) => {
  const token = process.env.BRAPI_TOKEN;
  const url = `https://brapi.dev/api/quote/${ticker}?token=${token}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data?.results?.length || !data.results[0].regularMarketPrice) {
      return null;
    }

    const stock = data.results[0];

    return {
      lastPrice: stock.regularMarketPrice,
      name: stock.longName || stock.shortName || ticker,
      currency: stock.currency || 'BRL',
    };
  } catch (err) {
    console.error('Erro BRAPI:', err.message);
    return null;
  }
};

module.exports = { getBrapiData };
// This module fetches stock data from the Brapi API using a ticker symbol.