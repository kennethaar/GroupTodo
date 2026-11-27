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
    onclick: () => { close(); presentStart(path, {root, presenter: true, win: true}); },
    onkeydown: e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); anchor.focus(); } }},
    "With presenter window"));
  // The old way, for one screen: the slides over this tab (#515).
  menu.append(el("button", {role: "menuitem", title: "The slides over this page, for a single screen",
    onclick: () => { close(); presentStart(path, {root}); },
    onkeydown: e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); anchor.focus(); } }},
    "Full screen in this tab"));
  // A waiting screen with a countdown to the start (#486).
  menu.append(el("button", {role: "menuitem", title: "Slides on repeat and a countdown until the talk starts",
    onclick: () => { close(); openPresentWait(path); },
    onkeydown: e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); anchor.focus(); } }},
    "Count down to the start…"));
  wrap.append(menu);
  anchor.setAttribute("aria-expanded", "true");
  document.addEventListener("click", away, true);
  menu.querySelector("button").focus();
}
