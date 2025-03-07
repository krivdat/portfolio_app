import { g as getAssetsByUserId } from "../../../chunks/asset.js";
import { r as redirect } from "../../../chunks/index.js";
import { c as clearSession } from "../../../chunks/auth.js";
async function load({ locals }) {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
  const assets = await getAssetsByUserId(locals.user.id);
  return {
    assets,
    user: locals.user
  };
}
const actions = {
  logout: async ({ cookies }) => {
    clearSession(cookies);
    throw redirect(302, "/login");
  }
};
export {
  actions,
  load
};
