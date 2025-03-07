import { e as bind_props, c as pop, p as push } from "../../../chunks/index2.js";
import "../../../chunks/client.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$payload, $$props) {
  push();
  let form = $$props["form"];
  $$payload.out += `<h1>Register</h1> `;
  if (form?.error) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p style="color: red">${escape_html(form.error)}</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <form method="POST" action="?/register"><label for="username">Username:</label> <input type="text" id="username" name="username" required> <label for="password">Password:</label> <input type="password" id="password" name="password" required> <label for="confirmPassword">Confirm Password:</label> <input type="password" id="confirmPassword" name="confirmPassword" required> <label for="email">Email:</label> <input type="email" id="email" name="email" required> <label for="profile_picture">Profile Picture URL:</label> <input type="url" id="profile_picture" name="profile_picture"> <button type="submit">Register</button></form>`;
  bind_props($$props, { form });
  pop();
}
export {
  _page as default
};
