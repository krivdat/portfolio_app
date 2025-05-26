import { getSession } from '$lib/utils/auth';
import { getUserById } from '$lib/db/user';
import { error } from '@sveltejs/kit';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again after 15 minutes'
});

export const handle = async ({ event, resolve }) => {
  console.log('Event pathname:', event.url.pathname); // This will help identify where the problem occurs.
  // Attempt to get the IP address from the 'x-forwarded-for' header
  const ip =
    event.request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    event.getClientAddress();
  console.log(`Request from IP: ${ip}`);

  if (event.url.pathname.startsWith('/login')) {
    limiter(event.request, event.response, (err) => {
      if (err) {
        throw error(429, err.message);
      }
    });
  }

  const userId = getSession(event.cookies) || null;

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
      // Invalid session - clear it
      event.cookies.delete('sessionid', { path: '/' });
    }
  }

  const response = await resolve(event);

  return response;
};
