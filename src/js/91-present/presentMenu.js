/* ▶ Present ▾ (#431): ▾ drops down under itself with the other way to
   present. ▶ Present is beside it, so it is not offered twice. A second
   click, Esc or a click elsewhere closes it. */
function presentMenu(path, root = null, anchor = null) {
  const wrap = anchor?.closest(".presentsplit");
  const old = wrap?.querySelector(".presentpop");
  if (!wrap || old) { old?.remove(); anchor?.setAttribute("aria-expanded", "false"); return; }
  const menu = el("div", {class: "presentpop", role: "menu", "aria-label": "More ways to present"});
  const close = () => {
    menu.remove(); anchor.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", away, true);
  };
  const away = e => { if (!menu.contains(e.target) && !anchor.contains(e.target)) close(); };
  menu.append(el("button", {role: "menuitem", title: "Notes, what comes next and a timer on your own screen (P)",
    onclick: () => { close(); presentStart(path, {root, presenter: true}); },
    onkeydown: e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); anchor.focus(); } }},
    "With presenter window"));
  wrap.append(menu);
  anchor.setAttribute("aria-expanded", "true");
  document.addEventListener("click", away, true);
  menu.querySelector("button").focus();
}
