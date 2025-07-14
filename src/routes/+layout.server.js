import { redirect } from '@sveltejs/kit';
import { getAssetsByUserId } from '$lib/db/asset';
import { fetchStockPrices } from '$lib/utils/fintech';

export async function load({ locals, route }) {
	if (!locals.user && route.id !== '/login' && route.id !== '/register') {
		console.log('User not authenticated, redirecting to login');

		throw redirect(302, '/login');
	}

	let assets = [];
	let currentPrices = {};
	let pricesStatus = 'fresh';

	assets = locals.user?.id ? await getAssetsByUserId(locals.user.id) : [];
	if (assets && assets.length > 0) {
		const { data, status } = await fetchStockPrices(
			assets.filter((asset) => asset.ticker).map((asset) => asset.ticker)
		);
		currentPrices = data;
		pricesStatus = status;
	}

	return {
		user: locals.user,
		assets,
		currentPrices,
		pricesStatus
	};
}
