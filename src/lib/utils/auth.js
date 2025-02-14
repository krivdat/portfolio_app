const SESSION_COOKIE_NAME = 'sessionid';

export function setSession(cookies, userId) {
  cookies.set(SESSION_COOKIE_NAME, userId.toString(), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSession(cookies) {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function getSession(cookies) {
  try {
    if (!cookies || typeof cookies !== 'object' || typeof cookies.get !== 'function') {
      // console.warn("Inside /lib/utils/auth.js, Cookies object is invalid:", cookies);  // Log the value for inspection
      return null; // Or handle the error appropriately
    }
    const userId = cookies.get(SESSION_COOKIE_NAME);
    console.log("Inside /lib/utils/auth.js, userId:", userId);

    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    console.error("Error getting session from cookies:", error);
    return null; // Or handle the error appropriately
  }
}