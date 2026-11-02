/* An older vault kept purpose and vision as sections of one page. Split them. */
function migrateHorizons() {
  for (const legacy of HORIZONS_LEGACY) {
    if (!V.pages.has(legacy)) continue;
    const page = getPage(legacy);
    const headings = {purpose: "Purpose & principles", vision: "Vision (3-5 years)"};
    for (const [key, head] of Object.entries(headings)) {
      const blk = (page.blocks || []).find(b => trim(b.title) === head);
      const lines = blk ? (blk.children || []).map(c => c.title).filter(t => trim(t)) : [];
      if (lines.length && !getHorizon(key).length) setHorizon(key, lines);
    }
    removePage(legacy);
  }
}
