import { getAssetsByUserId } from '$lib/db/asset';
import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/utils/auth';

export async function load({ locals }) {
	const assets = await getAssetsByUserId(locals.user.id);

	return {
		assets
	};
}

export const actions = {
	logout: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(302, '/login');
	}
};
