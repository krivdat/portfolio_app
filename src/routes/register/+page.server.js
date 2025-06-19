import { fail, redirect } from '@sveltejs/kit';
import { createUser, getUserByUsername } from '$lib/db/user';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');
		const email = formData.get('email');
		const profilePicture = formData.get('profile_picture');
		const firstName = formData.get('first_name');
		const last_name =
			formData.get('second_name') || formData.get('lastname') || formData.get('last_name');

		if (!username || !password || !confirmPassword || !email) {
			return fail(400, { error: 'Please fill in all required fields.' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters long.' });
		}

		const existingUser = await getUserByUsername(username);
		if (existingUser) {
			return fail(400, { error: 'Username already taken.' });
		}
		try {
			console.log('Starting user registration process...');
			const userId = await createUser(
				username,
				password,
				email,
				profilePicture,
				firstName,
				last_name
			);
			console.log('User registered successfully with ID:', userId);
		} catch (error) {
			console.error('Registration error:', error);
			if (error.code === 'SQLITE_CONSTRAINT') {
				return fail(400, { error: 'Username or email already exists.' });
			}
			return fail(500, { error: error.message || 'Could not create user.' });
		}

		throw redirect(302, '/login');
	}
};
