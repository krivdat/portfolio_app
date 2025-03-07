import { e as bind_props, c as pop, p as push, f as ensure_array_like } from "../../../chunks/index2.js";
import "../../../chunks/client.js";
import { f as fallback } from "../../../chunks/equality.js";
import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import { p as page } from "../../../chunks/index3.js";
function AssetForm($$payload, $$props) {
  push();
  let asset = fallback(
    $$props["asset"],
    () => ({
      // Default values
      category: "",
      name: "",
      purchase_price: 0,
      purchase_date: "",
      quantity: 0,
      currency: "",
      ticker: ""
    }),
    true
  );
  let isUpdate = fallback($$props["isUpdate"], false);
  $$payload.out += `<form method="POST"${attr("action", isUpdate ? "?/update" : "?/create")}><label for="category">Category:</label> <input type="text" id="category" name="category"${attr("value", asset.category)} required> <label for="name">Name:</label> <input type="text" id="name" name="name"${attr("value", asset.name)} required> <label for="purchasePrice">Purchase Price:</label> <input type="number" id="purchasePrice" name="purchasePrice"${attr("value", asset.purchase_price)} required> <label for="purchaseDate">Purchase Date:</label> <input type="date" id="purchaseDate" name="purchaseDate"${attr("value", asset.purchase_date)} required> <label for="quantity">Quantity:</label> <input type="number" id="quantity" name="quantity"${attr("value", asset.quantity)} required> <label for="currency">Currency:</label> <input type="text" id="currency" name="currency"${attr("value", asset.currency)} required> <label for="ticker">Ticker:</label> <input type="text" id="ticker" name="ticker"${attr("value", asset.ticker)}> <button type="submit">${escape_html(isUpdate ? "Update Asset" : "Add Asset")}</button></form>`;
  bind_props($$props, { asset, isUpdate });
  pop();
}
function _page($$payload, $$props) {
  push();
  let assets;
  let data = $$props["data"];
  assets = data.assets;
  $$payload.out += `<h1>Assets</h1> `;
  if (page.data.session) {
    $$payload.out += "<!--[-->";
    AssetForm($$payload, {});
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p>Please <a href="/login">login</a> to manage your assets.</p>`;
  }
  $$payload.out += `<!--]--> `;
  if (assets && assets.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(assets);
    $$payload.out += `<ul><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let asset = each_array[$$index];
      $$payload.out += `<li><a${attr("href", `/assets/${asset.id}`)}>${escape_html(asset.name)} (${escape_html(asset.category)}) - ${escape_html(asset.ticker)}</a></li>`;
    }
    $$payload.out += `<!--]--></ul>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p>No assets found.</p>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
