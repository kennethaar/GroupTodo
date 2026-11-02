/* What the map draws with the current settings, and what it left out. */
function mapGraph() {
  const full = graphFull();
  const hide = new Set(PREF.get("map.hidden", MAP_HIDE_DEFAULT).split(",").filter(Boolean));
  const loners = PREF.get("map.loners", "1") === "1";
  const depth = PREF.get("graph.depth", "all");
  const n = full.nodes.length;
  const selAt = MAP.sel ? full.nodes.findIndex(nd => nd.key === MAP.sel) : -1;
  if (selAt < 0) MAP.sel = null;
  const kindOk = i => i === selAt || !hide.has(full.nodes[i].kind);
  // Degree counted among what is shown, so a page only a day page links to
  // counts as unlinked while the days are off.
  const deg = new Array(n).fill(0), nbrs = Array.from({length: n}, () => []);
  for (const [a, b] of full.edges) {
    if (!kindOk(a) || !kindOk(b)) continue;
    deg[a]++; deg[b]++; nbrs[a].push(b); nbrs[b].push(a);
  }
  let around = null;
  if (selAt >= 0 && depth !== "all") {
    around = new Set([selAt]);
    let ring = [selAt];
    for (let d = 0; d < Number(depth); d++) {
      const next = [];
      for (const i of ring) for (const j of nbrs[i]) if (!around.has(j)) { around.add(j); next.push(j); }
      ring = next;
    }
  }
  const g = graphPart(full, (nd, i) => kindOk(i) && (loners || deg[i] > 0 || i === selAt) && (!around || around.has(i)),
    mapCap(), MAP.sel);
  g.hidden = full.nodes.filter((nd, i) => !kindOk(i)).length;
  // A routine is used rather than linked to, so it is never "unlinked".
  g.loners = full.nodes.filter((nd, i) => kindOk(i) && !nd.ghost && deg[i] === 0 && nd.kind !== "checklist")
    .sort((a, b) => a.label.localeCompare(b.label));
  return g;
}
