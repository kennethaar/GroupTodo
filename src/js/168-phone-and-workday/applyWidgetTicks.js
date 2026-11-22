/* What was ticked in a widget: each [x] line found by its words in what was
   written there (WIDGET_IDS), and its page line marked done (#474). How many,
   and the files holding a tick whose page is not read yet: those are left as
   they are until it is, so no tick is lost (partly). */
async function applyWidgetTicks(rec, backend, seen, partly = false) {
  let ids = {};
  try { ids = JSON.parse((await backend.readText(WIDGET_IDS)) || "{}"); } catch (_) { ids = {}; }
  let done = 0;
  const waiting = new Set();
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
        if (!page || stillLoading(rec, r.p)) { if (partly) waiting.add(file); return; }
        let b = null;
        walkBlocks(page.blocks, x => { if (!b && x.title === r.k && OPEN_STATES[x.state]) b = x; });
        if (b) { setBlockState(r.p, b, "DONE"); done++; }
      });
    }
  }
  if (done) clearMemo();
  return {done, waiting};
}
