import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/utils/auth';

export const actions = {
	default: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(302, '/login');
	}
};
