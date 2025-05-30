import { getAssetsByUserId } from '$lib/db/asset';
import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/utils/auth';
import yahooFinance from 'yahoo-finance2';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 15 * 60 }); // Cache for 15 minutes

const fetchStockPrices = async (tickers) => {
	const cachedData = cache.get('stockPrices');

	if (cachedData) {
		console.log('Using cached data');
		return cachedData;
	}

	const results = await yahooFinance.quote(tickers);
	// Convert array to object with ticker as key
	const stockPrices = results.reduce((acc, result) => {
		acc[result.symbol] = {
			price: result.regularMarketPrice,
			currency: result.currency
		};
		return acc;
	}, {});
	cache.set('stockPrices', stockPrices);
	return stockPrices;
};

export async function load({ locals }) {
	const assets = await getAssetsByUserId(locals.user.id);

	const currentPrices = await fetchStockPrices(
		assets.filter((asset) => asset.ticker).map((asset) => asset.ticker)
	);

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
