import { getAssetsByUserId, createAsset } from '$lib/db/asset';
import { fail } from '@sveltejs/kit';
import { parseDate } from '$lib/utils/date';

export async function load({ locals }) {
	const assets = await getAssetsByUserId(locals.user.id);
	console.log('In file /routes/assets/page.server.js, assets: ', assets);

	return {
		assets
	};
}

export const actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		console.log('In file /routes/assets/page.server.js, formdata: ', formData);
		const category = formData.get('category');
		const name = formData.get('name');
		const purchasePrice = parseFloat(formData.get('purchasePrice'));
		const purchaseDate = formData.get('purchaseDate');
		const quantity = parseFloat(formData.get('quantity'));
		const currency = formData.get('currency');
		const ticker = formData.get('ticker');
		const status = formData.get('status') || 'open';
		const closingPrice = formData.get('closing_price')
			? parseFloat(formData.get('closing_price'))
			: null;
		const closingDate = formData.get('closing_date') || null;
		const closingNote = formData.get('closing_note') || null;

		if (
			!category ||
			!name ||
			isNaN(purchasePrice) ||
			!purchaseDate ||
			isNaN(quantity) ||
			!currency
		) {
			return fail(400, { message: 'Invalid input' });
		}

		try {
			const parsedPurchaseDate = parseDate(purchaseDate);

			if (!parsedPurchaseDate) {
				return fail(400, { message: 'Invalid purchase date' });
			}

			await createAsset(
				locals.user.id,
				category,
				name,
				purchasePrice,
				parsedPurchaseDate,
				quantity,
				currency,
				ticker,
				status,
				closingPrice,
				closingDate,
				closingNote
			);
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Could not create asset' });
		}
	}
};
