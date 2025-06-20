import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/utils/auth';

export const actions = {
	default: async ({ cookies }) => {
		await clearSession(cookies);
		throw redirect(302, '/login');
	}
};
