import yahooFinance from 'yahoo-finance2';
import NodeCache from 'node-cache';

export async function fetchStockPrices(tickers) {
	global.stockPricesCache = global.stockPricesCache || new NodeCache({ stdTTL: 15 * 60 }); // Cache for 15 minutes
	global.exchangeRatesCache = global.exchangeRatesCache || new NodeCache({ stdTTL: 24 * 15 * 60 }); // Cache for 24 hours
	const stockPricesCache = global.stockPricesCache;
	const exchangeRatesCache = global.exchangeRatesCache;

	const cachedStockPrices = stockPricesCache.get('stockPrices');
	let exchangeRates = exchangeRatesCache.get('exchangeRates');

	if (cachedStockPrices) {
		console.log('Using cached data');
		return cachedStockPrices;
	}

	if (!exchangeRates) {
		console.log('Fetching exchange rates');
		const exchangeRateResults = await yahooFinance.quote(['USDEUR=X', 'EURCZK=X', 'USDCZK=X']);
		console.log('Exchange rates fetched', exchangeRateResults);
		exchangeRates = exchangeRateResults.reduce((acc, result) => {
			acc[result.symbol.slice(0, -2)] = {
				rate: result.regularMarketPrice
			};
			return acc;
		}, {});
		exchangeRatesCache.set('exchangeRates', exchangeRates);
		console.log('New exchange rates cached', exchangeRates);
	} else {
		console.log('Using cached exchange rates');
	}

	// Wait for exchangeRates to be available before using
	if (!exchangeRates['USDEUR']?.rate) {
		throw new Error('USDEUR exchange rate not available');
	}

	const results = await yahooFinance.quote(tickers);
	// Convert array to object with ticker as key
	const stockPrices = results.reduce((acc, result) => {
		if (result.symbol === 'BTC-USD') {
			// Special handling for BTC-USD
			acc[result.symbol] = {
				price: result.regularMarketPrice * (exchangeRates['USDEUR']?.rate ?? 1),
				currency: 'EUR'
			};
		} else {
			acc[result.symbol] = {
				price: result.regularMarketPrice,
				currency: result.currency
			};
		}
		return acc;
	}, {});

	stockPricesCache.set('stockPrices', stockPrices);
	return stockPrices;
}
