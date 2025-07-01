const { getBrapiData } = require('../api/brapi');
const { getTwelveData } = require('../api/twelvedata');

const verifyTickerExists = async (ticker, currency) => {
  try {
    if (currency === 'BRL') {
      const result = await getBrapiData(ticker);
      return !!result.lastPrice;
    } else {
      const result = await getTwelveData(ticker);
      return !!result.lastPrice;
    }
  } catch (error) {
    console.error('Ticker verification failed:', error.message);
    return false;
  }
};

module.exports = verifyTickerExists;
