function drawSidePage() {
  if (HELP_SIDE) { drawHelpPane(); return; }
  if (SIDE_PAGE && (!inSpace(SIDE_PAGE.space, () => V.pages.has(SIDE_PAGE.path)) || onScreen(SIDE_PAGE))) SIDE_PAGE = null;
  const s = SIDE_PAGE || sidePinShown();
  /* Gone, or now the page on screen: one copy of its lines is enough. Today's
     day page is on Today already, and on a phone a pin would be all there is. */
  if (!s || !inSpace(s.space, () => V.pages.has(s.path)) || onScreen(s) ||
      (s.pinned && sidePin().today && !s.branch && state.view === "today" && !state.todayDay && !state.todayWho) ||
      (s.pinned && NARROW.matches)) {
    hideSidePane(); return;
  }
  SIDE_SHOWN = s;
  const pane = $("#pagePane"), top = pane.scrollTop;
  SIDE_DRAWING = true;
  let node;
  try {
    node = inSpace(s.space, () => {
      const page = getPage(s.path), root = sideBranch(page, s.branch);
      if (root) return sideBranchView(s, page, root);
      const keep = {view: state.view, pagePath: state.pagePath};
      state.view = "page"; state.pagePath = s.path;
      try { return viewPage(); } finally { Object.assign(state, keep); }
    });
  } finally { SIDE_DRAWING = false; }
  const label = s.pinned ? "Unpin from the right" : "Pin to the right: it stays while you move about";
  pane.replaceChildren(el("div", {class: "panebar"},
    el("button", {class: "iconbtn panepin" + (s.pinned ? " on" : ""), title: label, "aria-label": label,
      "aria-pressed": String(!!s.pinned),
      onclick: () => s.pinned ? unpinSide()
        : pinToSide(s.space, s.path, s.branch ? inSpace(s.space, () => ensureBlockId(s.path, sideBranch(getPage(s.path), s.branch))) : "")}, svgIcon(ICON_PIN)),
    el("div", {style: "flex:1"}),
    el("button", {class: "iconbtn", title: "Expand to the full page", "aria-label": "Expand to the full page",
      onclick: () => { const {space, path} = s; SIDE_PAGE = null; SIDE_FOLLOW = false; openPageIn(space, path); }}, "⤢"),
    el("button", {class: "iconbtn", title: s.pinned ? "Unpin and close" : "Close", "aria-label": s.pinned ? "Unpin and close" : "Close",
      onclick: s.pinned ? unpinSide : closeSidePage}, svgIcon(ICON_CLOSE))), node);
  pane.classList.toggle("pinned", !!s.pinned);
  pane.hidden = false;
  document.body.classList.add("pane-open");
  resolveAssets(pane);
  pane.scrollTop = top;
}
