function renameTracker(from, to) {
  const keyOf = t => "tracker-" + to + (t.code ? "_" + t.code : "");
  const mine = t => !!t && t.name === from;
  const reprops = props => {
    let hit = false;
    const out = {};
    for (const [k, v] of Object.entries(props || {})) {
      const t = parseTracker(k + "::");
      if (mine(t)) { out[keyOf(t)] = v; hit = true; } else out[k] = v;
    }
    return hit ? out : null;
  };
  let pages = 0;
  for (const sp of LOADED.keys()) inSpace(sp, () => {
    for (const p of allPages(q => isJournalPath(q) || q.startsWith(DIRS.lists + "/"))) {
      const page = getPage(p);
      if (!page) continue;
      let hit = false;
      const np = reprops(page.props);
      if (np) { page.props = np; hit = true; }
      walkBlocks(page.blocks || [], b => {
        const t = parseTracker(b.title);
        if (mine(t)) { b.title = trim(keyOf(t) + ":: " + t.raw); hit = true; }
        const bp = reprops(b.props);
        if (bp) { b.props = bp; hit = true; }
      });
      if (hit) { touch(p); pages++; }
    }
  });
  const pick = PREF.get("trk.measure." + from, "");
  if (pick && !PREF.get("trk.measure." + to, "")) PREF.set("trk.measure." + to, pick);
  // Its page goes with it, unless the name it took has one already.
  const at = trackerPageAt(from);
  if (at && !trackerPageAt(to)) inSpace(at.space, () => {
    const dest = trackerPagePath(to);
    if (!moveFile(at.path, dest)) return;
    getPage(dest).props.title = trackerTitle(to);
    touch(dest);
    if (state.view === "page" && state.pagePath === at.path) state.pagePath = dest;
  });
  render();
  notify(trackerTitle(from) + " is now " + trackerTitle(to) + ", on " + pages + " page" + (pages === 1 ? "" : "s") + ".");
}
