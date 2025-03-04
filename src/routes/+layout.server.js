import { getSession } from '$lib/utils/auth';

export const load = async ({ cookies }) => {
  // console.log('Inside file /routes/+layout.server.js, cookies:', cookies);

  const session = getSession(cookies);
  // console.log('Inside file /routes/+layout.server.js, session:', session);

  return {
    session // equals to userId
  };
}