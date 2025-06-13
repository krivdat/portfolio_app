import { getAssetsByUserId } from '$lib/db/asset';
import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/utils/auth';
import yahooFinance from 'yahoo-finance2';
import NodeCache from 'node-cache';

const stockPricesCache = new NodeCache({ stdTTL: 15 * 60 }); // Cache for 15 minutes
const exchangeRatesCache = new NodeCache({ stdTTL: 24 * 15 * 60 }); // Cache for 24 hours

const fetchStockPrices = async (tickers) => {
	const cachedStockPrices = stockPricesCache.get('stockPrices');
	let exchangeRates = exchangeRatesCache.get('exchangeRates');

	if (cachedStockPrices) {
		console.log('Using cached data');
		return cachedStockPrices;
	}

	if (exchangeRates) {
		console.log('Using cached exchange rates');
	} else {
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
	}

	const results = await yahooFinance.quote(tickers);
	// Convert array to object with ticker as key
	const stockPrices = results.reduce((acc, result) => {
		if (result.symbol === 'BTC-USD') {
			// Special handling for BTC-USD
			acc[result.symbol] = {
				price: result.regularMarketPrice * exchangeRates['USDEUR'].rate,
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
};

export async function load({ locals }) {
	const assets = await getAssetsByUserId(locals.user.id);
	let currentPrices = {};

	if (assets && assets.length > 0) {
		currentPrices = await fetchStockPrices(
			assets.filter((asset) => asset.ticker).map((asset) => asset.ticker)
		);
	}

	return {
		assets,
		currentPrices
	};
}

export const actions = {
	logout: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(302, '/login');
	}
};
