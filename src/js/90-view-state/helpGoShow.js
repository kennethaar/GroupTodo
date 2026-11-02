/* From the full help: go to the screen, open "This page", point at number i. */
function helpGoShow(id, i) {
  const t = HELP[id];
  if (!t || !t.view || t.view === "help" || t.view === "page") return;
  go(t.view, t.sub ? {sub: t.sub} : {});
  HELP_SIDE = "page";
  HELP_MARKS = i != null || HELP_MARKS;
  drawSidePage();
  if (i != null) requestAnimationFrame(() => helpExplain(i));
}
