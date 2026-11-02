function openTemplateRenewal() {
  const {year, items} = expiringTemplates();
  if (!items.length) { notify("Every template named for a year has a copy for the next one."); return; }
  const picked = new Set(items);
  const many = new Set(items.map(it => it.space)).size > 1;
  const body = el("div", {},
    el("p", {class: "hint"}, "These only apply in " + year + ". Copy the ones you still want, " +
      "lines and trackers included, so they carry on in " + (year + 1) + "."),
    ...items.map(it => el("label", {class: "tplrow"},
      el("input", {type: "checkbox", checked: "", onchange: e => e.target.checked ? picked.add(it) : picked.delete(it)}),
      el("code", {}, it.name), "→", el("code", {}, it.next),
      many ? el("span", {class: "plain"}, it.space) : null,
      el("span", {style: "flex:1"}),
      el("button", {class: "textbtn", type: "button", onclick: e => { e.preventDefault(); closeModal(); openPageIn(it.space, it.path); }}, "Open"))));
  modal({
    center: true, title: "Templates for " + year, hint: "they stop when the year does",
    body,
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Not now"),
      el("button", {class: "btn primary", onclick: () => {
        for (const it of picked) renewTemplate(it);
        closeModal(); render();
        notify(picked.size + " template" + (picked.size === 1 ? "" : "s") + " copied to " + (year + 1) + ".");
      }}, "Copy to " + (year + 1))],
  });
}
