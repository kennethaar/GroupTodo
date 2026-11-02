/* Every tracker line on every day page in the areas on screen, oldest first. */
function trackerEntries() {
  return memo("trackerEntries", () => acrossSpaces(() => {
    const out = [];
    for (const path of allPages(p => isJournalPath(p))) {
      const date = (/\d{4}-\d{2}-\d{2}/.exec(baseName(path)) || [])[0];
      const page = date && getPage(path);
      if (!page) continue;
      const add = (t, block) => { if (t) out.push(Object.assign(t, {date, path, block, space: V.space})); };
      for (const [k, v] of Object.entries(page.props || {}))
        if (/^tracker-/i.test(k)) add(parseTracker(k + ":: " + v), null);
      walkBlocks(page.blocks, b => {
        add(parseTracker(b.title), b.id);
        for (const [k, v] of Object.entries(b.props || {}))
          if (/^tracker-/i.test(k)) add(parseTracker(k + ":: " + v), b.id);
      });
    }
    return out;
  }).sort((a, b) => a.date.localeCompare(b.date)));
}
