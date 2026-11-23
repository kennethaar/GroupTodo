/* The newest place kept in any loaded area (#492), or null. Today's Journal
   is no place to go on to: you are there. Reads GTD.md without making one. */
function lastPlaceBest() {
  let best = null;
  for (const name of new Set([V.space, ...LOADED.keys()])) {
    if (!name || folderWaiting(name)) continue;
    const raw = inSpace(name, () => V.pages.get(SETTINGS_PATH)?.props?.last);
    let v = null;
    try { v = JSON.parse(String(raw || "")); } catch (e) { continue; }
    if (!v || !v.at || !v.place?.view) continue;
    if (!best || v.at > best.at) best = {...v, space: v.space || name};
  }
  const p = best?.place;
  if (!p || p.view === "today" && (!p.todayDay || p.todayDay === todayISO()) && (!p.sub || p.sub === defaultSub("today"))) return null;
  return best;
}
