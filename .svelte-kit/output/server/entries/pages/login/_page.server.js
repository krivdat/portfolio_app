import { f as fail, r as redirect } from "../../../chunks/index.js";
import { g as getUserByUsername, c as comparePassword } from "../../../chunks/user.js";
import { s as setSession } from "../../../chunks/auth.js";
const actions = {
  login: async ({ request, cookies }) => {
    if (!cookies) {
      throw new Error("Cookies object is invalid: undefined");
    }
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    if (!username || !password) {
      return fail(400, { error: "Please provide username and password." });
    }
    const user = await getUserByUsername(username);
    if (!user) {
      return fail(401, { error: "Invalid credentials." });
    }
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return fail(401, { error: "Invalid credentials." });
    }
    setSession(cookies, user.id);
    throw redirect(302, "/dashboard");
  }
};
export {
  actions
};
