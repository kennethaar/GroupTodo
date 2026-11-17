/* ---------- New from a template (#420) ----------
   Where something new is started: the built-in templates first, then the
   project templates written here, then Import a file… for one made elsewhere.
   One is picked on the left and said in plain words on the right; the main
   button makes it. pick names the one to show picked, by its path. */
function openTemplatePicker(pick = null) {
  const items = templateChoices();
  let cur = Math.max(0, items.findIndex(t => t.path && t.path === pick));
  const list = el("div", {class: "tplpick", role: "group", "aria-label": "Templates"});
  const more = el("div", {class: "tplmore", "aria-live": "polite"});
  const cta = el("button", {class: "btn primary", onclick: () => { const t = items[cur]; closeModal(); t.run(); }});
  const draw = () => {
    list.replaceChildren(...items.map((t, i) => el("button", {"aria-pressed": String(i === cur),
      onclick: () => { cur = i; draw(); }, ondblclick: () => cta.click()},
      el("span", {class: "nm"}, t.name), el("span", {class: "sub"}, t.kind))));
    const t = items[cur];
    more.replaceChildren(el("h3", {}, t.name), el("p", {}, t.blurb),
      ...t.parts.map(([label, chips]) => chips.length ? el("div", {class: "tplpart"},
        el("div", {class: "tplh"}, label), el("div", {class: "tplchips"}, ...chips.map(x => el("span", {class: "chip"}, x)))) : ""));
    cta.textContent = t.cta;
  };
  draw();
  modal({center: true, title: "New from a template",
    body: el("div", {},
      el("div", {class: "tplsplit"}, list, more),
      el("button", {class: "textbtn tplimport", title: "A template or checklist written as a Markdown list",
        onclick: () => { closeModal(); importTemplateFile(); }}, "Import a file…")),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"), cta],
    onKey: e => {
      const d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
      if (d) {
        cur = (cur + d + items.length) % items.length; draw();
        list.children[cur].focus();
        return true;
      }
      return false;
    }});
  setTimeout(() => list.children[cur] && list.children[cur].focus(), 30);
}
