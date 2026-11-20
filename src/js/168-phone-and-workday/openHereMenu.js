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
  for (const [space, list] of HERE.others) for (const o of list)
    menu.append(hereRow(space, o, close, {role: "menuitem",
      onkeydown: e => {
        if (e.key === "Escape") { close(); anchor.focus(); }
        else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          const all = [...menu.querySelectorAll("button")], i = all.indexOf(e.target);
          all[(i + (e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length]?.focus();
        }
      }}));
  anchor.after(menu);
  anchor.setAttribute("aria-expanded", "true");
  document.addEventListener("click", away, true);
  menu.querySelector("button")?.focus();
}
