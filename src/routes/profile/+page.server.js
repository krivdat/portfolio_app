import { fail } from '@sveltejs/kit';
import { updateUserById } from '$lib/db/user';

export const load = async ({ locals }) => {
	return {
		user: locals.user
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const first_name = formData.get('first_name');
		const last_name = formData.get('last_name');
		const email = formData.get('email');
		const profile_picture = formData.get('profile_picture');

		try {
			await updateUserById(locals.user.id, { first_name, last_name, email, profile_picture });
			return { success: 'Profile updated successfully.' };
		} catch (error) {
			return fail(400, { error: error.message || 'Failed to update profile.' });
		}
	}
};
