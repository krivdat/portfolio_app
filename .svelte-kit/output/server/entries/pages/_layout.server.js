import { g as getSession } from "../../chunks/auth.js";
const load = async ({ cookies }) => {
  const session = getSession(cookies);
  return {
    session
  };
};
export {
  load
};
