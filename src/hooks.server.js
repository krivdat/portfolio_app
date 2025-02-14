import { getSession } from '$lib/utils/auth';
import { getUserByUsername, getUserById } from '$lib/db/user';
import { error, redirect } from '@sveltejs/kit';
import rateLimit from 'express-rate-limit';
// import { createRequestHandler } from '@hattip/adapter-node';
// import { RequestHandler } from '@sveltejs/kit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again after 15 minutes'
});

export const handle = async ({ event, resolve }) => {

  if (event.url.pathname.startsWith('/api/')) {
    limiter(event.request, event.response, (err) => {
      if (err) {
        throw error(429, err.message);
      }
    });
  }
  // console.log('In hooks.server.js, event:', event);

  const userId = getSession(event.cookies);

  if (userId) {
    const user = await getUserById(userId); // Use getUserById
    if (user) {
      event.locals.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_picture: user.profile_picture
      };
    } else {
      // Invalid session - clear it
      event.cookies.delete('sessionid', { path: '/' });
    }
  }

  return await resolve(event);
};

export const getSession = (event) => {
  return event.locals.user ? { user: event.locals.user } : {};
};