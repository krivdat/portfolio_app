import { h as head, d as slot, c as pop, p as push } from "../../chunks/index2.js";
import "../../chunks/client.js";
import { p as page } from "../../chunks/index3.js";
function _layout($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Portfolio Tracker</title>`;
  });
  $$payload.out += `<div class="container svelte-11ww4jq"><nav class="svelte-11ww4jq"><ul class="svelte-11ww4jq"><li><a href="/" class="svelte-11ww4jq">Home</a></li> `;
  if (page.data.session) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<li><a href="/dashboard" class="svelte-11ww4jq">Dashboard</a></li> <li><a href="/assets" class="svelte-11ww4jq">Assets</a></li>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<li><a href="/login" class="svelte-11ww4jq">Login</a></li> <li><a href="/register" class="svelte-11ww4jq">Register</a></li>`;
  }
  $$payload.out += `<!--]--></ul></nav> <!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></div>`;
  pop();
}
export {
  _layout as default
};
