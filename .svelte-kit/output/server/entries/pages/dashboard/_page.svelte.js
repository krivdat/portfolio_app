import { g as current_component, e as bind_props, c as pop, p as push, f as ensure_array_like } from "../../../chunks/index2.js";
import * as d3 from "d3";
import "../../../chunks/client.js";
import { f as formatDate } from "../../../chunks/date.js";
import { p as page } from "../../../chunks/index3.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import { a as attr } from "../../../chunks/attributes.js";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
function formatCurrency(number, locale = "en-US", currencyCode = "USD") {
  try {
    if (typeof number !== "number") {
      return "";
    }
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2
      // Ensure two decimal places
    });
    return formatter.format(number);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return "";
  }
}
function PieChartD3($$payload, $$props) {
  push();
  let data = $$props["data"];
  console.log("Inside PieChartD3.svelte, data =", data);
  let svgNode;
  let width = 300;
  let height = 300;
  let radius = Math.min(width, height) / 2;
  let svg;
  onDestroy(() => {
    if (svg) {
      svg.selectAll("*").remove();
    }
  });
  function drawChart() {
    if (svg) {
      svg.selectAll("*").remove();
    }
    const total = d3.sum(data, (d) => d.value);
    const color = d3.scaleOrdinal().domain(data.map((d) => d.label)).range(d3.schemeCategory10);
    const arc = d3.arc().innerRadius(radius * 0.4).outerRadius(radius);
    const pie = d3.pie().value((d) => d.value).sort(null);
    svg = d3.select(svgNode).attr("width", width).attr("height", height).append("g").attr("transform", `translate(${width / 2},${height / 2})`);
    const g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
    g.append("path").attr("d", arc).style("fill", (d) => color(d.data.label));
    g.append("text").attr("transform", (d) => `translate(${arc.centroid(d)})`).attr("dy", ".35em").style("text-anchor", "middle").text((d) => {
      const percentage = (d.data.value / total * 100).toFixed(1);
      return `${d.data.label} (${percentage}%)`;
    });
  }
  if (data) {
    drawChart();
  }
  $$payload.out += `<svg></svg>`;
  bind_props($$props, { data });
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let assets = data.assets;
  let categoryData = [];
  const categoryCounts = {};
  assets.forEach((asset) => {
    categoryCounts[asset.category] = (categoryCounts[asset.category] || 0) + asset.purchase_price * asset.quantity;
  });
  categoryData = Object.entries(categoryCounts).map(([category, value]) => ({ label: category, value }));
  function calculateProfitLoss(asset) {
    const currentPrice = asset.purchase_price;
    return (currentPrice - asset.purchase_price) * asset.quantity;
  }
  $$payload.out += `<h1>Dashboard</h1> `;
  if (page.data.user) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>Welcome, ${escape_html(page.data.user.username)} (${escape_html(page.data.user.email)})</p> `;
    if (page.data.user.profile_picture) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<img${attr("src", page.data.user.profile_picture)} alt="Profile" width="50">`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <form method="POST" action="?/logout"><button type="submit">Logout</button></form> `;
  if (assets && assets.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(assets);
    $$payload.out += `<div><div><h2>Asset Allocation</h2> `;
    PieChartD3($$payload, { data: categoryData });
    $$payload.out += `<!----></div> <div><h2>Asset List</h2> <table><thead><tr><th>Name</th><th>Category</th><th>Quantity</th><th>Purchase Price</th><th>Purchase Date</th><th>Profit/Loss</th></tr></thead><tbody><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let asset = each_array[$$index];
      $$payload.out += `<tr><td>${escape_html(asset.name)}</td><td>${escape_html(asset.category)}</td><td>${escape_html(asset.quantity)}</td><td>${escape_html(formatCurrency(asset.purchase_price, "en-US", asset.currency))}</td><td>${escape_html(formatDate(asset.purchase_date))}</td><td>${escape_html(formatCurrency(calculateProfitLoss(asset), "en-US", asset.currency))}</td></tr>`;
    }
    $$payload.out += `<!--]--></tbody></table></div></div>`;
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
