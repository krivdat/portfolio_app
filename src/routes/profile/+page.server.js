import { fail } from '@sveltejs/kit';
import { updateUserById, getUserById, comparePassword, updateUserPassword } from '$lib/db/user';

export const load = async ({ locals }) => {
	return {
		user: locals.user
	};
};

export const actions = {
	'update-profile': async ({ request, locals }) => {
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
	},
	'change-password': async ({ request, locals, cookies }) => {
		const formData = await request.formData();
		const old_password = formData.get('old_password');
		const new_password = formData.get('new_password');
		const new_password2 = formData.get('new_password2');
		if (!old_password || !new_password || !new_password2) {
			return fail(400, { error: 'All password fields are required.' });
		}
		if (new_password !== new_password2) {
			return fail(400, { error: 'New passwords do not match.' });
		}
		const user = await getUserById(locals.user.id);
		const valid = await comparePassword(old_password, user.password);
		if (!valid) {
			return fail(400, { error: 'Old password is incorrect.' });
		}
		await updateUserPassword(locals.user.id, new_password);
		cookies.delete('sessionid', { path: '/' });
		return { success: 'Password changed successfully. Please log in again.' };
	}
};
