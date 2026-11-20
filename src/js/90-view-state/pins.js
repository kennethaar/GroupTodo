/* ---------- pinned pages ----------
   Any page can be pinned to the sidebar from the ⋯ beside its title, as many
   as you like, and they sit under the rest in the order you drag them into.
   Pins are yours, not this browser's (#33): each area keeps them on your own
   person page, pins:: [[Kitchen]], [[Paper]], so they follow you to every
   device and address, and a renamed page keeps its pin as any link does.
   This device keeps {space, path} each as well: the order across areas, and
   the pins of an area where you have no name yet. A pin whose page is not
   there (deleted, or its area not ticked on) is not shown but kept, so an
   undo or ticking the area back brings it back. */
function pins() {
  let local;
  try { const l = JSON.parse(PREF.get("pins", "[]")); local = Array.isArray(l) ? l : []; }
  catch (_) { local = []; }
  const onPage = new Map();
  for (const space of new Set([V.space || "", ...LOADED.keys()])) {
    const paths = inSpace(space, () => areaPins(local.filter(p => (p.space || "") === space).map(p => p.path)));
    if (paths) onPage.set(space, paths);
  }
  const out = local.filter(p => !onPage.has(p.space || "") || onPage.get(p.space || "").includes(p.path));
  for (const [space, paths] of onPage)
    for (const path of paths)
      if (!out.some(p => (p.space || "") === space && p.path === path)) out.push({space, path});
  return out;
}
