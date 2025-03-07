import { e as bind_props, c as pop, p as push } from "../../../../chunks/index2.js";
import "../../../../chunks/client.js";
import "../../../../chunks/client2.js";
import { f as formatDate } from "../../../../chunks/date.js";
import { a as attr } from "../../../../chunks/attributes.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let asset = data.asset;
  asset = {
    ...asset,
    purchase_date: formatDate(asset.purchase_date, "en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    // Format for input type="date"
  };
  $$payload.out += `<h1>Edit Asset</h1> <form method="POST" action="?/update"><label for="category">Category:</label> <input type="text" id="category" name="category"${attr("value", asset.category)} required> <label for="name">Name:</label> <input type="text" id="name" name="name"${attr("value", asset.name)} required> <label for="purchasePrice">Purchase Price:</label> <input type="number" id="purchasePrice" name="purchasePrice"${attr("value", asset.purchase_price)} required> <label for="purchaseDate">Purchase Date:</label> <input type="date" id="purchaseDate" name="purchaseDate"${attr("value", asset.purchase_date)} required> <label for="quantity">Quantity:</label> <input type="number" id="quantity" name="quantity"${attr("value", asset.quantity)} required> <label for="currency">Currency:</label> <input type="text" id="currency" name="currency"${attr("value", asset.currency)} required> <label for="ticker">Ticker:</label> <input type="text" id="ticker" name="ticker"${attr("value", asset.ticker || "")}> <button type="submit">Update Asset</button></form> <button>Delete Asset</button>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
