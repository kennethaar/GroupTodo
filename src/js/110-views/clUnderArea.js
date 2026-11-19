/* Clarify's Note for a responsibility (#437): the line stays a note and links
   the responsibility it is for. Picked in a box, so it is dealt when the line
   has its link; a line under one already is dealt at once. */
function clUnderArea(path, b) {
  const has = linksIn(b.title).map(findExistingPage).find(p => p && pageKind(p) === "area");
  if (!has) { pickAreaFor(path, b); return; }
  CL.pending = null;
  if (dayCandidate(b)) clDeal(path, b);
  clStampIfDone(path);
  notify("Already under " + pageTitle(has) + ".");
  render();
}
