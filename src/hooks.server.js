import { getSession } from '$lib/utils/auth';
import { getUserById } from '$lib/db/user';
import { error } from '@sveltejs/kit';
// import rateLimit from 'express-rate-limit';

// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 100, // limit each IP to 100 requests per windowMs
// 	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// 	message: 'Too many requests, please try again after 15 minutes'
// });

export const handle = async ({ event, resolve }) => {
	const userId = getSession(event.cookies) || null;

	if (userId) {
		const user = await getUserById(userId);
		if (user) {
			// Add first_name and last_name to event.locals.user
			event.locals.user = {
				id: user.id,
				username: user.username,
				email: user.email,
				profile_picture: user.profile_picture,
				first_name: user.first_name,
				last_name: user.last_name
			};
		} else {
			// Invalid session - clear it
			event.cookies.delete('sessionid', { path: '/' });
		}
	}

	const response = await resolve(event);

	return response;
};
