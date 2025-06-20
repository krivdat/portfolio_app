import { getSession } from '$lib/utils/auth';
import { getUserById } from '$lib/db/user';

// --- In-memory rate limiting ---
const RATE_LIMIT = 60; // requests
const WINDOW_MS = 60 * 1000; // 1 minute
const rateLimitStore = new Map();

function cleanupRateLimitStore() {
	const now = Date.now();
	for (const [key, { reset }] of rateLimitStore.entries()) {
		if (reset < now) {
			rateLimitStore.delete(key);
		}
	}
}

export const handle = async ({ event, resolve }) => {
	// --- Rate limiting logic ---
	const ip = event.getClientAddress();
	let userId = await getSession(event.cookies);
	const identifier = userId || ip;
	const now = Date.now();
	let entry = rateLimitStore.get(identifier);
	if (!entry || entry.reset < now) {
		entry = { count: 1, reset: now + WINDOW_MS };
		rateLimitStore.set(identifier, entry);
	} else {
		entry.count++;
	}
	if (entry.count > RATE_LIMIT) {
		return new Response('Too Many Requests', {
			status: 429,
			headers: {
				'X-RateLimit-Limit': RATE_LIMIT.toString(),
				'X-RateLimit-Remaining': Math.max(0, RATE_LIMIT - entry.count).toString(),
				'X-RateLimit-Reset': Math.ceil(entry.reset / 1000).toString()
			}
		});
	}
	// Periodically clean up old entries
	if (Math.random() < 0.01) cleanupRateLimitStore();

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
