import { f as fail, r as redirect } from "../../../chunks/index.js";
import { g as getUserByUsername, a as createUser } from "../../../chunks/user.js";
const actions = {
  register: async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const email = formData.get("email");
    const profilePicture = formData.get("profile_picture");
    if (!username || !password || !confirmPassword || !email) {
      return fail(400, { error: "Please fill in all required fields." });
    }
    if (password !== confirmPassword) {
      return fail(400, { error: "Passwords do not match." });
    }
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return fail(400, { error: "Username already taken." });
    }
    try {
      await createUser(username, password, email, profilePicture);
    } catch (error) {
      console.error(error);
      return fail(500, { error: "Could not create user." });
    }
    throw redirect(302, "/login");
  }
};
export {
  actions
};
