function render() {
  if (RENDER_HOLD) { RENDER_MISSED = true; return; }
  if (!V.loaded) return;
  if (SPACE_TRANSITION) return;
  const began = performance.now();
  refreshVisiblePageTemplate();
  flyHide();                 // it hangs off a line this redraw is about to replace
  suggestClose();
  captureScroll();
  clearMemo();
  QUIET_CACHE = null;
  TOUR_PATH_CACHE = undefined;
  if (!VIEWS[state.view]) state.view = "today";
  renderNav();
  renderSpacesButton();
  renderContextChip();
  scheduleMeetPaint();
  const c = $("#content");
  c.textContent = "";
  c.removeAttribute("aria-busy");
  FOCUS_NODE = null;
  let node = folderAwayShown() ? folderAwayPanel(V.space) : VIEWS[state.view]();
  if (FOCUS_NODE) node = el("div", {class: "wrap"}, FOCUS_NODE);
  c.append(node);
  document.body.classList.toggle("solview", node.classList.contains("solwrap"));
  if (state.view !== "review") SIDE_FOLLOW = false;
  resolveAssets(c);          // before the scroll: a picture keeps the room it had (#382)
  restoreScroll();
  const title = state.view === "page" && state.pagePath ? pageTitle(state.pagePath) : VIEW_TITLE[state.view];
  document.title = (title ? title + " · " : "") + "GroupToDo";
  drawSidePage();
  helpHintDraw();
  usageNoteView();
  syncNavArrows();
  syncSendButton();
  applyRefocus();
  const ms = performance.now() - began;
  if (!INIT_DONE || ms > RENDER_SLOW_MS) loadMark("drew " + state.view + (state.pagePath ? " " + state.pagePath : ""), began);
  /* When a start's screen was first there to write in, and from where (#181). */
  const away = DRAW_NOTE && V.space && folderAwayShown();
  if (DRAW_NOTE && V.space && !(away && AWAY_SAID)) {
    const note = DRAW_NOTE;
    if (away) AWAY_SAID = true; else DRAW_NOTE = null;   // the panel is not the page: said once, the page waited for
    const rec = LOADED.get(V.space);
    loadStep(V.space, away ? "the Allow access panel on screen, " + note + " waits for your tap"
      : note + " on screen (" + state.view + "), from " + (rec && rec.backend && rec.backend.kind === "fs"
        ? "the folder" : "the browser copy: " + V.pages.size + " pages, today's page " +
          (V.pages.has(journalPath(todayISO())) ? "there" : "not there")));
  }
}
