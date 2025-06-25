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
		console.log('Using cached data for stock prices');
		return cachedStockPrices;
	}

	if (!exchangeRates) {
		console.log('Fetching exchange rates');
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
		exchangeRatesCache.set('exchangeRates', exchangeRates);
		console.log('New exchange rates cached', exchangeRates);
	} else {
		console.log('Using cached exchange rates');
	}

	// Wait for exchangeRates to be available before using
	if (!exchangeRates['USDEUR']?.rate) {
		throw new Error('USDEUR exchange rate not available');
	}

	if (!exchangeRates['GBPEUR']?.rate) {
		throw new Error('GBPEUR exchange rate not available');
	}

	const results = await yahooFinance.quote(tickers);
	// console.log(`Fetched stock prices for ${tickers.join(', ')}`, results);

	// Convert array to object with ticker as key
	const supportedCurrencies = ['USD', 'GBP', 'CZK', 'EUR'];
	const filteredResults = results.filter((result) => supportedCurrencies.includes(result.currency));
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

	stockPricesCache.set('stockPrices', stockPrices);
	return stockPrices;
}
