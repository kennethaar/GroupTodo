/* #408 Who is here and where: a row each. A row with a page opens it. */
function openHereMenu(anchor) {
  const old = $(".heremenu");
  if (old) { old.remove(); anchor.setAttribute("aria-expanded", "false"); return; }
  const menu = el("div", {class: "heremenu", role: "menu"});
  const close = () => {
    menu.remove(); anchor.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", away, true);
  };
  const away = e => { if (!menu.contains(e.target) && !anchor.contains(e.target)) close(); };
  for (const [space, list] of HERE.others) for (const o of list) {
    const where = o.title || (o.page ? baseName(o.page) : "");
    const parts = [avatarNode(o.name, 22), el("span", {}, el("b", {}, o.name), where ? " · " + where : "")];
    if (o.page) menu.append(el("button", {role: "menuitem", title: "Open " + where,
      onclick: () => { close(); openPageIn(space, o.page); },
      onkeydown: e => {
        if (e.key === "Escape") { close(); anchor.focus(); }
        else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          const all = [...menu.querySelectorAll("button")], i = all.indexOf(e.target);
          all[(i + (e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length]?.focus();
        }
      }}, ...parts));
    else menu.append(el("div", {class: "hererow"}, ...parts));
  }
  anchor.after(menu);
  anchor.setAttribute("aria-expanded", "true");
  document.addEventListener("click", away, true);
  menu.querySelector("button")?.focus();
}
