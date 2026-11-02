/* ---------- putting one on a line ----------
   when: null for just this line, or {days: [0-6]} (0 is Sunday; all seven is
   every day) to write it into the year's journal templates as well, so it
   turns up on those days by itself. */
const dayOfPath = path => (isJournalPath(path) && /\d{4}-\d{2}-\d{2}/.exec(baseName(path)) || [])[0] || null;
const weekdayOf = iso => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d).getDay(); };
const pageHasTracker = (page, name) => {
  let hit = Object.keys(page.props || {}).some(k => parseTracker(k + "::")?.name === name);
  walkBlocks(page.blocks, b => { if (parseTracker(b.title)?.name === name) hit = true; });
  return hit;
};
