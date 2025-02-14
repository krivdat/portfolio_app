import { getAssetsByUserId, createAsset } from '$lib/db/asset';
import { fail } from '@sveltejs/kit';
import { parseDate } from '$lib/utils/date';

export async function load({ locals }) {
  if (!locals.user) {
    return {
      assets: []
    };
  }

  const assets = await getAssetsByUserId(locals.user.id);
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
    const category = formData.get('category');
    const name = formData.get('name');
    const purchasePrice = parseFloat(formData.get('purchasePrice'));
    const purchaseDate = formData.get('purchaseDate');
    const quantity = parseFloat(formData.get('quantity'));
    const currency = formData.get('currency');
    const ticker = formData.get('ticker');

    if (!category || !name || isNaN(purchasePrice) || !purchaseDate || isNaN(quantity) || !currency) {
      return fail(400, { message: 'Invalid input' });
    }

    try {
      const parsedPurchaseDate = parseDate(purchaseDate);

      if (!parsedPurchaseDate) {
        return fail(400, { message: 'Invalid purchase date' });
      }

      await createAsset(locals.user.id, category, name, purchasePrice, parsedPurchaseDate, quantity, currency, ticker);
    } catch (error) {
      console.error(error);
      return fail(500, { message: 'Could not create asset' });
    }
    return { success: true }; // Indicate success (SvelteKit will handle UI updates)
  }
};