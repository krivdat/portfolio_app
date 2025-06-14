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
		const category = formData.get('category');
		const name = formData.get('name');
		const purchasePrice = parseFloat(formData.get('purchasePrice'));
		const purchaseDate = formData.get('purchaseDate');
		const quantity = parseFloat(formData.get('quantity'));
		const currency = formData.get('currency');
		const ticker = formData.get('ticker');

		if (
			!category ||
			!name ||
			isNaN(purchasePrice) ||
			!purchaseDate ||
			isNaN(quantity) ||
			!currency
		) {
			return fail(400, { error: 'Invalid input' });
		}

		try {
			const parsedPurchaseDate = parseDate(purchaseDate);

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
				ticker
			);
			if (!updatedAsset) {
				return fail(404, { error: 'Asset not found or unauthorized' });
			}
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
