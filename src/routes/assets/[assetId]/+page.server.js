import { getAssetById, updateAsset, deleteAsset } from '$lib/db/asset';
import { fail, error } from '@sveltejs/kit';
import { parseDate } from '$lib/utils/date';

export async function load({ params, locals }) {
	const asset = await getAssetById(params.assetId);

	if (!asset) {
		throw error(404, 'Asset not found');
	}

	if (asset.user_id !== locals.user.id) {
		throw error(403, 'Unauthorized');
	}

	return { asset };
}

export const actions = {
	update: async ({ request, params, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		console.log('Inside update action in +page.server.js, assetId: ', params.assetId);

		const formData = await request.formData();
		const status = formData.get('status') || 'open';

		// If closing, fetch original asset and use its original values for non-closing fields
		let origAsset = null;
		if (status === 'closed') {
			origAsset = await getAssetById(params.assetId);
			if (!origAsset || origAsset.user_id !== locals.user.id) {
				return fail(404, { error: 'Asset not found or unauthorized' });
			}
		}

		const category = status === 'closed' ? origAsset.category : formData.get('category');
		const name = status === 'closed' ? origAsset.name : formData.get('name');
		const purchasePrice =
			status === 'closed' ? origAsset.purchase_price : parseFloat(formData.get('purchasePrice'));
		const purchaseDate =
			status === 'closed' ? origAsset.purchase_date : formData.get('purchaseDate');
		const quantity =
			status === 'closed' ? origAsset.quantity : parseFloat(formData.get('quantity'));
		const currency = status === 'closed' ? origAsset.currency : formData.get('currency');
		const ticker = status === 'closed' ? origAsset.ticker : formData.get('ticker');
		const closingPrice = formData.get('closing_price')
			? parseFloat(formData.get('closing_price'))
			: null;
		const closingDate = formData.get('closing_date') || null;
		const closingNote = formData.get('closing_note') || null;

		if (
			(status === 'open' &&
				(!category ||
					!name ||
					isNaN(purchasePrice) ||
					!purchaseDate ||
					isNaN(quantity) ||
					!currency)) ||
			(status !== 'open' && (isNaN(closingPrice) || !closingDate))
		) {
			console.error('Invalid input data', formData);
			return fail(400, { error: 'Invalid input' });
		}

		try {
			const parsedPurchaseDate = parseDate(purchaseDate);
			const parsedClosingDate = closingDate ? parseDate(closingDate) : null;

			if (!parsedPurchaseDate) {
				return fail(400, { error: 'Invalid purchase date' });
			}

			if (quantity < 0) {
				return fail(400, { error: 'Quantity cannot be negative' });
			}

			const updatedAsset = await updateAsset(
				params.assetId,
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
				parsedClosingDate,
				closingNote
			);
			if (!updatedAsset) {
				return fail(404, { error: 'Asset not found or unauthorized' });
			}
			console.log('Updated asset: ', updatedAsset);
			return { success: true, asset: updatedAsset };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Could not update asset' });
		}
	},
	delete: async ({ params, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}
		try {
			const deletedAsset = await deleteAsset(params.assetId, locals.user.id);
			if (!deletedAsset) {
				return fail(404, { message: 'Asset not found or unauthorized' });
			}
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Could not delete asset' });
		}
		return { success: true };
	}
};
