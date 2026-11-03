/* Every scene in reading order, with its place in the story when it has one.
   A scene told after one that happens later is told out of order. */
function bookTimeline(scope = bookScope()) {
  const {scenes} = bookAnalysis(scope), kinds = {};
  const rows = scenes.map((sc, i) => {
    const t = storyTime(sceneProp(sc.scene, "when"));
    if (t) kinds[t.kind] = (kinds[t.kind] || 0) + 1;
    return {...sc, n: i + 1, when: sceneProp(sc.scene, "when"), t};
  });
  const clock = Object.keys(kinds).sort((a, b) => kinds[b] - kinds[a])[0] || null;
  let latest = -Infinity;
  for (const r of rows) {
    if (!r.t || r.t.kind !== clock) { r.t = null; continue; }
    r.back = r.t.at < latest;
    latest = Math.max(latest, r.t.at);
  }
  /* The same character at one time in two places: a slip in continuity. */
  const clashes = [], byTime = new Map();
  for (const r of rows) if (r.t) (byTime.get(r.t.at) || byTime.set(r.t.at, []).get(r.t.at)).push(r);
  for (const same of byTime.values()) same.forEach((a, i) => same.slice(i + 1).forEach(b => {
    const pa = sceneProp(a.scene, "place"), pb = sceneProp(b.scene, "place");
    if (!pa || !pb || pa.toLowerCase() === pb.toLowerCase()) return;
    const here = new Set([...namesIn(sceneProp(a.scene, "pov")), ...namesIn(sceneProp(a.scene, "with"))].map(r => castEntryOf(r)?.key).filter(Boolean));
    for (const k of [...namesIn(sceneProp(b.scene, "pov")), ...namesIn(sceneProp(b.scene, "with"))].map(r => castEntryOf(r)?.key).filter(Boolean))
      if (here.has(k)) clashes.push({who: k, a, b});
  }));
  return {rows, clock, clashes};
}
