import { e as bind_props, c as pop, p as push } from "../../../chunks/index2.js";
import "../../../chunks/client.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$payload, $$props) {
  push();
  let form = $$props["form"];
  $$payload.out += `<h1>Login</h1> `;
  if (form?.error) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p style="color: red">${escape_html(form.error)}</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <form method="POST" action="?/login"><label for="username">Username:</label> <input type="text" id="username" name="username" required> <label for="password">Password:</label> <input type="password" id="password" name="password" required> <button type="submit">Login</button></form>`;
  bind_props($$props, { form });
  pop();
}
export {
  _page as default
};
