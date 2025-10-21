import YahooFinance from 'yahoo-finance2';
import { getCache, setCache } from '../db/cache.js';

const yahooFinance = new YahooFinance();

export async function fetchStockPrices(tickers) {
  console.log('Fetching stock prices for tickers:', tickers);

  const stockPricesCacheKey = 'stockPrices';
  const exchangeRatesCacheKey = 'exchangeRates';

  // Helper function to check if cache is valid, timestamp = expiry time
  const isCacheValid = (cache) => cache && cache.timestamp > Date.now();

  // 1. Try to get fresh stock prices from cache
  const cachedStockPrices = getCache(stockPricesCacheKey);
  if (isCacheValid(cachedStockPrices)) {
    const allTickersCached = tickers.every((ticker) =>
      Object.keys(cachedStockPrices.value).includes(ticker)
    );
    if (allTickersCached) {
      console.log('Using cached data for stock prices', cachedStockPrices.value);
      return { data: cachedStockPrices.value, status: 'cached' };
    }
  }

  // 2. Try to get exchange rates from cache
  let exchangeRates;
  const cachedExchangeRates = getCache(exchangeRatesCacheKey);
  if (isCacheValid(cachedExchangeRates)) {
    exchangeRates = cachedExchangeRates.value;
    // console.log('Using cached exchange rates: ', exchangeRates);
  }

  // 3. Fetch from Yahoo Finance and gold-api if cache is stale or missing
  try {
    // Fetch exchange rates if they were not in the valid cache
    if (!exchangeRates) {
      // console.log('Fetching exchange rates');
      const exchangeRateResults = await yahooFinance.quote([
        'USDEUR=X',
        'GBPEUR=X',
        'EURCZK=X',
        'USDCZK=X'
      ]);
      exchangeRates = exchangeRateResults.reduce((acc, result) => {
        acc[result.symbol.slice(0, -2)] = {
          rate: result.regularMarketPrice
        };
        return acc;
      }, {});
      setCache(exchangeRatesCacheKey, exchangeRates, 24 * 60 * 60 * 1000); // 24 hours
      // console.log('New exchange rates cached', exchangeRates);
    }

    // Fetch stock prices
    const results = await yahooFinance.quote(tickers);
    console.log('Data returned from Yahoo Finance: ', results);
    // Process and cache the new stock prices
    const supportedCurrencies = ['USD', 'GBP', 'CZK', 'EUR'];
    const filteredResults = results.filter((result) =>
      supportedCurrencies.includes(result.currency)
    );
    const unsupportedTickers = results
      .filter((result) => !supportedCurrencies.includes(result.currency))
      .map((result) => result.symbol);

    const stockPrices = filteredResults.reduce((acc, result) => {
      if (result.currency === 'USD' && exchangeRates['USDEUR']?.rate) {
        acc[result.symbol] = {
          price: result.regularMarketPrice * exchangeRates['USDEUR'].rate,
          currency: 'EUR'
        };
      } else if (result.currency === 'GBP' && exchangeRates['GBPEUR']?.rate) {
        acc[result.symbol] = {
          price: result.regularMarketPrice * exchangeRates['GBPEUR'].rate,
          currency: 'EUR'
        };
      } else if (result.currency === 'CZK' && exchangeRates['EURCZK']?.rate) {
        acc[result.symbol] = {
          price: result.regularMarketPrice * exchangeRates['EURCZK'].rate,
          currency: 'EUR'
        };
      } else if (result.currency === 'EUR') {
        acc[result.symbol] = {
          price: result.regularMarketPrice,
          currency: 'EUR'
        };
      }
      return acc;
    }, {});

    if (unsupportedTickers.length > 0) {
      console.warn(`Unsupported currencies for tickers: ${unsupportedTickers.join(', ')}`);
    }

    setCache(stockPricesCacheKey, stockPrices, 15 * 60 * 1000); // 15 minutes
    console.log('New stock prices cached', stockPrices);
    return { data: stockPrices, status: 'fresh' };
  } catch (error) {
    console.error('Failed to fetch fresh data from Yahoo Finance:', error.message);

    // 4. Fallback to stale cache if fetching fails
    if (cachedStockPrices) {
      console.log('Using stale stock prices from cache', cachedStockPrices.value);
      return { data: cachedStockPrices.value, status: 'stale' };
    }

    // 5. If all else fails, throw an error
    throw new Error('Could not fetch stock prices and no cache is available.');
  }
}
