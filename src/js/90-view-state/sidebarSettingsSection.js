/* ---------- Settings > Sidebar (#238) ----------
   Every item with a box to show it and arrows to move it. Moving past a line
   takes it into the next group. Written to pages/8/sidebar.md, so it goes with
   the area. Focus stays on the arrow, so a row walks with the keyboard. */
function sidebarSettingsSection() {
  const order = navOrder(), hidden = navHidden();
  const card = el("div", {class: "card navset"},
    el("div", {class: "listblurb"}, "What the sidebar shows, top to bottom. For everyone in this area, in " +
      SIDEBAR_PATH.replace(PAGES + "/", "") + "."));
  const move = (i, d) => {
    const next = order.slice();
    [next[i], next[i + d]] = [next[i + d], next[i]];
    const id = order[i];
    saveSidebar(next, hidden);
    requestAnimationFrame(() => {
      const b = document.querySelector('.navset [data-nav="' + id + '"][data-dir="' + d + '"]') ||
                document.querySelector('.navset [data-nav="' + id + '"][data-dir="' + -d + '"]');
      if (b) b.focus();
    });
  };
  let seps = 0;
  order.forEach((t, i) => {
    if (t === NAV_SEP) {
      card.append(el("div", {class: "navset-line"}, seps++ ? "At the foot" : "Line"));
      return;
    }
    const it = navEntry(t), keep = t === NAV_KEEP;
    const box = el("input", {type: "checkbox", "aria-label": "Show " + it.label,
      onchange: e => {
        const h = new Set(hidden);
        if (e.target.checked) h.delete(t); else h.add(t);
        saveSidebar(order, h);
      }});
    box.checked = !hidden.has(t);
    box.disabled = keep;
    const arrow = (d, sym, word) => el("button", {class: "btn sm ghost", "data-nav": t, "data-dir": String(d),
      "aria-label": "Move " + it.label + " " + word, title: "Move " + word,
      disabled: (d < 0 ? i === 0 : i === order.length - 1) ? "" : null, onclick: () => move(i, d)}, sym);
    card.append(el("div", {class: "prow"},
      el("label", {class: "nm"}, box, " ", el("span", {class: "ic bw"}, it.icon), " ", it.label),
      keep ? el("span", {class: "sub"}, "always: the way back here")
        : it.when ? el("span", {class: "sub"}, "once there is something in it") : null,
      arrow(-1, "↑", "up"), arrow(1, "↓", "down")));
  });
  if (getPage(SIDEBAR_PATH)) card.append(el("div", {class: "helpsee"},
    el("button", {class: "textbtn", onclick: sidebarDefault}, "Back to the default")));
  return section("Sidebar", null, card);
}
