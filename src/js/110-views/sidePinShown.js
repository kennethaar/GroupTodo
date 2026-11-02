/* The pin as a page to draw: today's day page is looked up anew each time. */
function sidePinShown() {
  const p = sidePin();
  if (!p) return null;
  const space = p.space || "";
  if (space && space !== V.space && !(LOADED.has(space) && visibleSpaces().includes(space))) return null;
  const path = p.today ? inSpace(space, () => ensureJournal(todayISO())) : p.path;
  return {space, path, branch: p.branch || "", pinned: true};
}
