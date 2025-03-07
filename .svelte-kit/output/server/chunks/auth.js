const SESSION_COOKIE_NAME = "sessionid";
function setSession(cookies, userId) {
  cookies.set(SESSION_COOKIE_NAME, userId.toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7
  });
}
function clearSession(cookies) {
  cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
}
function getSession(cookies) {
  try {
    if (!cookies || typeof cookies !== "object" || typeof cookies.get !== "function") {
      return null;
    }
    const userId = cookies.get(SESSION_COOKIE_NAME);
    console.log("Inside /lib/utils/auth.js, userId:", userId);
    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    console.error("Error getting session from cookies:", error);
    return null;
  }
}
export {
  clearSession as c,
  getSession as g,
  setSession as s
};
