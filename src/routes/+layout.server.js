import { redirect } from '@sveltejs/kit';

export async function load({ locals, route }) {
	if (!locals.user && route.id !== '/login' && route.id !== '/register') {
		console.log('User not authenticated, redirecting to login');

		throw redirect(302, '/login');
	}

	return {
		user: locals.user
	};
}
