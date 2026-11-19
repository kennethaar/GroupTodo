/* #436 "New things go to ▾": the shown areas, the current one marked. */
function openAreaLands(anchor) {
  const old = $(".alandsmenu");
  if (old) { old.remove(); anchor.setAttribute("aria-expanded", "false"); return; }
  const menu = el("div", {class: "alandsmenu", role: "menu"});
  const close = () => {
    menu.remove(); anchor.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", away, true);
  };
  const away = e => { if (!menu.contains(e.target) && e.target !== anchor) close(); };
  for (const name of visibleSpaces()) {
    const cur = name === Spaces.active;
    menu.append(el("button", {role: "menuitemradio", "aria-checked": String(cur), class: cur ? "cur" : "",
      onclick: async () => { close(); if (!cur) { await openSpace(name); render(); } },
      onkeydown: e => {
        if (e.key === "Escape") { close(); anchor.focus(); }
        else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          const all = [...menu.children], i = all.indexOf(e.target);
          all[(i + (e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length].focus();
        }
      }},
      el("span", {class: "adot", "aria-hidden": "true", style: "background:" + spaceColor(name)}), name));
  }
  anchor.after(menu);
  anchor.setAttribute("aria-expanded", "true");
  document.addEventListener("click", away, true);
  (menu.querySelector(".cur") || menu.firstChild)?.focus();
}
