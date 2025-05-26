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
      await createUser(username, password, email, profilePicture);
    } catch (error) {
      console.error(error);
      return fail(500, { error: 'Could not create user.' });
    }

    throw redirect(302, '/login');
  }
};