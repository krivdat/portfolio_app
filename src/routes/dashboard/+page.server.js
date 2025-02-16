import { getAssetsByUserId } from '$lib/db/asset';
import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/utils/auth';

export async function load({ locals }) {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  const assets = await getAssetsByUserId(locals.user.id);

  return {
    assets,
    user: locals.user
  };
}

export const actions = {
  logout: async ({ cookies }) => {
    clearSession(cookies);
    throw redirect(302, '/login');
  }
};