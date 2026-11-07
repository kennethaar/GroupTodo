function go(view, opts = {}) {
  navRecord();
  /* Arriving from somewhere else opens a view at the reading last picked for
     it, or at its first, the list, which is also the quickest to draw. */
  if (view !== state.view) {
    state.jz = null;
    state.todayDay = null;
    state.todayWeek = null;
    if (!("sub" in opts)) state.sub = defaultSub(view);
  }
  /* ---------- arriving at the mind map ----------
     If you came from a page, that page is the middle, rather than whatever
     happens to have the most links in the vault. */
  const sub = opts.sub || (view === state.view ? state.sub : defaultSub(view));
  if (view === "pages" && sub === "mindmap" && opts.graphFocus == null &&
      state.view === "page" && state.pagePath)
    opts = Object.assign({graphFocus: (V.space || "") + "\u0000" + state.pagePath}, opts);
  // Worked out before this arrival is counted, so the tour asks about the
  // places you have left rather than the one you are standing in.
  const leaving = tourPending();
  tourNoteView(view, opts);
  state.view = view;
  if (view === "next") coachMark("next");
  Object.assign(state, opts);
  document.body.classList.remove("nav-open");
  closeSpacesMenu();
  render();
  navRecord();
  if (leaving.length) maybeAskTourCheckoff(leaving);
}
