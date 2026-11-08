function renderNav() {
  const me = whoAmI();
  $("#brandName").textContent = me || "Set your name";
  const logo = $("#brandLogo"), face = me ? avatarOf(me) : "";
  logo.textContent = "";
  if (face) logo.append(el("img", {src: face, alt: ""})); else logo.textContent = "G";
  $("#brand").classList.toggle("active", state.view === "me");

  const nav = $("#nav");
  nav.textContent = "";
  for (const it of navItems()) {
    if (it === "sep") { nav.append(el("div", {class: "nav-sep"})); continue; }
    if (it === "grow") { nav.append(el("div", {class: "nav-grow"})); continue; }
    if (it === "pins") { nav.append(...navPins()); continue; }
    if (it.id === "timer") { nav.append(timerNavItem(it)); continue; }
    const here = state.view === it.id || (it.id === "projects" && state.view === "review");
    if (it.when && !here && !it.when()) continue;
    const n = navCount(it.id);
    const hot = (it.id === "today" && dueNow().some(a => a.due < todayISO())) ||
                (it.id === "projects" && reviewDue());
    /* Next unfolds into its contexts, Waiting for into the people you are
       waiting on, Chores into its rooms; each remembers whether it was left open. */
    const fold = it.id === "next" && allContextNames().length > 0
      ? {pref: "nav.ctxOpen", rows: navContexts, shut: "Fold the contexts away", show: "Show every context"}
      : it.id === "waiting" && n > 0
      ? {pref: "nav.waitOpen", rows: navWaiting, shut: "Fold the people away", show: "Show everyone you are waiting on"}
      : it.id === "chores" && choreRows().length > 0
      ? {pref: "nav.choreOpen", rows: navChores, shut: "Fold the rooms away", show: "Show every room"}
      : null;
    const folds = !!fold;
    const open = folds && PREF.get(fold.pref, "0") === "1";
    nav.append(el("button", {
      class: "nav-item" + (here ? " active" : "") + (it.small ? " small" : ""),
      "aria-current": here ? "page" : null,
      onclick: e => goFromNav(it.id, e.currentTarget),
    },
      el("span", {class: "ic bw"}, it.icon.startsWith("<") ? svgIcon(it.icon) : it.icon),
      el("span", {class: "lbl"}, it.label),
      folds ? el("span", {class: "fold", role: "button", "aria-expanded": String(open),
        title: open ? fold.shut : fold.show,
        onclick: e => { e.stopPropagation(); PREF.set(fold.pref, open ? "0" : "1"); renderNav(); }},
        svgIcon(open ? ICON_CARET : ICON_CHEVRON_RIGHT)) : null,
      n ? el("span", {class: "cnt" + (hot ? " hot" : "")}, String(n)) : null));
    if (open) nav.append(...fold.rows());
    if (it.id === "pages") { const load = navLoading(); if (load) nav.append(load); }
  }
}
