import { g as getSession } from "./auth.js";
import { b as getUserById } from "./user.js";
import { e as error } from "./index.js";
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  // Disable the `X-RateLimit-*` headers
  message: "Too many requests, please try again after 15 minutes"
});
const handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/api/")) {
    limiter(event.request, event.response, (err) => {
      if (err) {
        throw error(429, err.message);
      }
    });
  }
  const userId = getSession(event.cookies);
  if (userId) {
    const user = await getUserById(userId);
    if (user) {
      event.locals.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_picture: user.profile_picture
      };
    } else {
      event.cookies.delete("sessionid", { path: "/" });
    }
  }
  return await resolve(event);
};
export {
  handle
};
