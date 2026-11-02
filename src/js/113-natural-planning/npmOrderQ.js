function npmOrderQ() {
  const move = (n, by) => { const c = NPM.comps.splice(n, 1)[0]; NPM.comps.splice(n + by, 0, c); NPM.ordered = true; npmSave(); render(); };
  return [el("ol", {class: "npmorder"}, ...NPM.comps.map((c, n) => {
    const above = NPM.comps[n - 1];
    const waits = !!(c.after && npmComp(c.after));
    return el("li", {},
      el("span", {class: "n"}, String(n + 1)),
      el("span", {class: "nm"}, c.name),
      above ? fchip(waits ? "After " + npmComp(c.after).name : "Can start now", waits, () => {
        c.after = waits ? null : above.id; NPM.ordered = true; npmSave(); render();
      }) : el("span", {class: "npmsay"}, "Starts first"),
      el("button", {class: "iconbtn", title: "Up", "aria-label": "Move " + c.name + " up", disabled: n ? null : "disabled", onclick: () => move(n, -1)}, "↑"),
      el("button", {class: "iconbtn", title: "Down", "aria-label": "Move " + c.name + " down", disabled: n < NPM.comps.length - 1 ? null : "disabled", onclick: () => move(n, 1)}, "↓"));
  })), el("div", {class: "npmsay"}, "A component that waits gets its next action once the one before is done.")];
}
