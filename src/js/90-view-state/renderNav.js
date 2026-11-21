function renderNav() {
  const me = whoAmI();
  $("#brandName").textContent = me || "Set your name";
  // #447 the logo stays GroupToDo's; your picture is its own button at the right.
  const mine = $("#brandMe");
  mine.textContent = "";
  mine.append(avatarNode(me || "?", 26));
  mine.classList.toggle("active", state.view === "me");

  const nav = $("#nav");
  const sync = $("#syncRow");      // held: clearing the nav takes it along (#397); Focus beside it (#323)
  nav.textContent = "";
  /* #399 on a computer the Timer floats in the bottom right corner; on a
     phone that corner is the capture button's, so it stays in the drawer. */
  const float = $("#timerFloat");
  if (float) float.textContent = "";
  const floats = !!float && matchMedia("(min-width:641px)").matches;
  /* #323 where the Journal has no top bar, Help waits under the Timer;
     #421 in Focus too, on a phone as well. */
  if (float) float.append(el("button", {class: "floathelp", id: "floatHelp", title: "Help (?)",
    onclick: () => setHelp(!helpOpen())}, el("span", {"aria-hidden": "true"}, "? "), "Help"));
  const items = navItems();
  // #450 with Weekly review hidden, Projects lights up for the review.
  const reviewShown = items.some(it => it && it.id === "review");
  for (const it of items) {
    if (it === "sep") { nav.append(el("div", {class: "nav-sep"})); continue; }
    if (it === "grow") { nav.append(el("div", {class: "nav-grow"})); continue; }
    if (it === "pins") { nav.append(...navPins()); continue; }
    if (it.id === "timer") { if (floats) float.prepend(timerNavItem(it)); else nav.append(timerNavItem(it)); continue; }
    const here = state.view === it.id || (it.id === "projects" && state.view === "review" && !reviewShown);
    if (it.when && !here && !it.when()) continue;
    const due = (it.id === "projects" || it.id === "review") && reviewDue();
    // The review is marked only when it is due: what needs attention, or a dot.
    const n = it.id === "review" ? (due ? navCount("review") || "•" : null) : navCount(it.id);
    const hot = (it.id === "today" && dueNow().some(a => a.due < todayISO())) || due;
    /* Next unfolds into its contexts, Waiting for into the people you are
       waiting on, Chores into its rooms, Projects into its areas once any
       active project has one; each remembers whether it was left open. */
    const fold = it.id === "next" && allContextNames().length > 0
      ? {pref: "nav.ctxOpen", rows: navContexts, shut: "Fold the contexts away", show: "Show every context"}
      : it.id === "waiting" && n > 0
      ? {pref: "nav.waitOpen", rows: navWaiting, shut: "Fold the people away", show: "Show everyone you are waiting on"}
      : it.id === "chores" && choreRows().length > 0
      ? {pref: "nav.choreOpen", rows: navChores, shut: "Fold the rooms away", show: "Show every room"}
      : it.id === "projects" && visibleProjects("1").some(areaOfRow)
      ? {pref: "nav.projOpen", rows: navProjects, shut: "Fold the areas away", show: "Show every area"}
      : null;
    const folds = !!fold;
    const open = folds && PREF.get(fold.pref, "0") === "1";
    nav.append(el("button", {
      class: "nav-item" + (here ? " active" : "") + (it.small ? " small" : ""),
      "aria-current": here ? "page" : null, "data-nav": it.id,
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
    /* #450 the review just marked done and Weekly review going: said on it
       while you are on the review, then it slides out (fades, with less motion). */
    if (it.id === "review" && REVIEW_NAV.leaving) {
      const b = nav.lastElementChild;
      if (state.view === "review") nav.append(el("div", {class: "navsay", role: "status"},
        "Leaves the sidebar until your next review. Always under Projects."));
      else {
        REVIEW_NAV.leaving = false;
        b.classList.add("leaving");
        b.setAttribute("aria-hidden", "true");
        b.addEventListener("animationend", () => b.remove());
        setTimeout(() => b.remove(), 700);
      }
    }
    if (it.id === "pages") { const load = navLoading(); if (load) nav.append(load); }
  }
  /* #397 Settings is the very last thing in the sidebar, wherever a sidebar
     page puts it, with the sync line, which opens it too, just above. */
  const set = [...nav.children].find(b => b.dataset.nav === NAV_KEEP);
  if (set) nav.append(set);
  if (sync && set) set.before(sync);
  else if (sync) nav.append(sync);
}
