import { createSession, getSessionByToken, deleteSession } from '$lib/db/session';

const SESSION_COOKIE_NAME = 'sessionid';

class InvalidCookiesError extends Error {
	constructor(message) {
		super(message);
		this.name = 'InvalidCookiesError';
	}
}

class SessionRetrievalError extends Error {
	constructor(message) {
		super(message);
		this.name = 'SessionRetrievalError';
	}
}

export async function setSession(cookies, userId) {
	if (!cookies || typeof cookies.set !== 'function') {
		throw new InvalidCookiesError(`Invalid cookies object: ${JSON.stringify(cookies)}`);
	}
	const { token } = await createSession(userId);
	cookies.set(SESSION_COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7
	});
}

export async function clearSession(cookies) {
	if (!cookies || typeof cookies.delete !== 'function') {
		throw new InvalidCookiesError(`Invalid cookies object: ${JSON.stringify(cookies)}`);
	}
	const token = cookies.get(SESSION_COOKIE_NAME);
	if (token) {
		await deleteSession(token);
	}
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export async function getSession(cookies) {
	try {
		if (!cookies || typeof cookies !== 'object' || typeof cookies.get !== 'function') {
			throw new InvalidCookiesError(`Invalid cookies object: ${JSON.stringify(cookies)}`);
		}
		const token = cookies.get(SESSION_COOKIE_NAME);
		if (!token) return null;
		const session = await getSessionByToken(token);
		if (!session || (session.expires_at && new Date(session.expires_at) < new Date())) {
			return null;
		}
		return session.user_id;
	} catch (error) {
		if (error instanceof InvalidCookiesError) {
			console.error('Error: Invalid cookies object provided:', error.message);
		} else {
			console.error('Error getting session from cookies:', error.message);
			throw new SessionRetrievalError('Failed to retrieve session from cookies');
		}
		return null;
	}
}
