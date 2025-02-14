import { fail, redirect } from '@sveltejs/kit';
import { getUserByUsername, comparePassword } from '$lib/db/user';
import { setSession } from '$lib/utils/auth';

export const actions = {
  login: async ({ request, cookies }) => {
    if (!cookies) {
      throw new Error("Cookies object is invalid: undefined");
    }

    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) {
      return fail(400, { error: 'Please provide username and password.' });
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return fail(401, { error: 'Invalid credentials.' });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return fail(401, { error: 'Invalid credentials.' });
    }

    setSession(cookies, user.id);
    throw redirect(302, '/dashboard');
  }
};