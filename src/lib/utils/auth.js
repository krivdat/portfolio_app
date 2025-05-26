const SESSION_COOKIE_NAME = 'sessionid';

class InvalidCookiesError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCookiesError";
  }
}

class SessionRetrievalError extends Error {
  constructor(message) {
    super(message);
    this.name = "SessionRetrievalError";
  }
}

export function setSession(cookies, userId) {
  if (!cookies || typeof cookies.set !== 'function') {
    throw new InvalidCookiesError(`Invalid cookies object: ${JSON.stringify(cookies)}`);
  }
  cookies.set(SESSION_COOKIE_NAME, userId.toString(), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSession(cookies) {
  if (!cookies || typeof cookies.delete !== 'function') {
    throw new InvalidCookiesError(`Invalid cookies object: ${JSON.stringify(cookies)}`);
  }
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function getSession(cookies) {
  try {
    if (!cookies || typeof cookies !== 'object' || typeof cookies.get !== 'function') {
      throw new InvalidCookiesError(`Invalid cookies object: ${JSON.stringify(cookies)}`);
    }
    const userId = cookies.get(SESSION_COOKIE_NAME);
    console.log("Inside /lib/utils/auth.js, userId:", userId);

    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    if (error instanceof InvalidCookiesError) {
      console.error("Error: Invalid cookies object provided:", error.message);
    } else {
      console.error("Error getting session from cookies:", error.message);
      throw new SessionRetrievalError("Failed to retrieve session from cookies");
    }
    return null;
  }
}