/* What was ticked in a widget: each [x] line found by its words in what was
   written there (WIDGET_IDS), and its page line marked done (#474). How many. */
async function applyWidgetTicks(rec, backend, seen) {
  let ids = {};
  try { ids = JSON.parse((await backend.readText(WIDGET_IDS)) || "{}"); } catch (_) { ids = {}; }
  let done = 0;
  for (const [file, rows] of Object.entries(ids)) {
    let text = null;
    try { text = await backend.readText(file); } catch (_) {}
    seen.set(file, text);
    if (text == null || !Array.isArray(rows)) continue;
    const used = new Set();
    for (const line of text.split("\n")) {
      const m = /^\s*[-*]\s+\[[xX]\]\s+(.*?)\s*$/.exec(line);
      if (!m) continue;
      const i = rows.findIndex((r, n) => !used.has(n) && r && r.t === m[1]);
      if (i < 0) continue;
      used.add(i);
      const r = rows[i];
      inSpace(rec.name, () => {
        const page = getPage(r.p);
        let b = null;
        if (page) walkBlocks(page.blocks, x => { if (!b && x.title === r.k && OPEN_STATES[x.state]) b = x; });
        if (b) { setBlockState(r.p, b, "DONE"); done++; }
      });
    }
  }
  if (done) clearMemo();
  return done;
}
