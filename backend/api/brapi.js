const fetch = require('node-fetch');

const getBrapiData = async (ticker) => {
  const token = process.env.BRAPI_TOKEN;
  const url = `https://brapi.dev/api/quote/${ticker}?token=${token}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data?.results?.length || !data.results[0].regularMarketPrice) {
    return null;
  }

  return {
    lastPrice: data.results[0].regularMarketPrice
  };
};

module.exports = { getBrapiData };
