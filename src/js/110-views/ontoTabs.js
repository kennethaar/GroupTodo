/* The tab row that says what the tray is dropped on. */
function ontoTabs(label, key, cur, tabs) {
  return el("div", {class: "btabs", style: "margin:0 0 10px"},
    el("span", {class: "say", style: "font-size:12px"}, label),
    ...tabs.map(([v, label]) => el("button", {class: "btab" + (cur === v ? " on" : ""), "aria-pressed": String(cur === v),
      onclick: () => { PREF.set(key, v); render(); }}, label)));
}
