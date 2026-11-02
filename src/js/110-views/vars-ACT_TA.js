/* Arrows move, Enter takes, and letters only ever aim, the way the pickers' typeahead does. */
let ACT_TA = {s: "", at: 0};
window.addEventListener("keydown", e => {
  if (state.view !== "review" || subNow() !== "actions" || !document.querySelector(".acthome")) return;
  if ($("#modalRoot").firstChild || e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
  const cols = ACT_COL.cols || [[], []];
  const stop = () => { e.preventDefault(); e.stopImmediatePropagation(); };
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    stop();
    const n = cols[ACT_COL.c].length;
    if (n) ACT_COL.i = (ACT_COL.i + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
  } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    stop();
    const to = e.key === "ArrowLeft" ? 0 : 1;
    if (cols[to].length) { ACT_COL.c = to; ACT_COL.i = Math.min(ACT_COL.i, cols[to].length - 1); }
  } else if (e.key === "Enter") {
    stop();
    const t = cols[ACT_COL.c][ACT_COL.i];
    if (t && !e.repeat) ACT_COL.take(t);
    return;
  } else if (e.key.length === 1 && /\p{L}/u.test(e.key)) {
    stop();
    const now = Date.now(), ch = e.key.toLocaleLowerCase();
    const s = now - ACT_TA.at < SOL_TA_MS ? ACT_TA.s + ch : ch;
    const flat = cols.flatMap((list, c) => list.map((t, i) => ({c, i, name: t.title.toLocaleLowerCase()})));
    const same = [...s].every(x => x === s[0]), w = same ? s[0] : s;
    const hits = flat.filter(x => x.name.startsWith(w));
    if (!hits.length) { ACT_TA = {s: "", at: 0}; return; }
    ACT_TA = {s, at: now};
    // The same letter again steps on to the next name starting with it.
    const at = hits.findIndex(x => x.c === ACT_COL.c && x.i === ACT_COL.i);
    const hit = same ? hits[(at + 1) % hits.length] : at >= 0 ? hits[at] : hits[0];
    ACT_COL.c = hit.c; ACT_COL.i = hit.i;
  } else return;
  actColPaint();
}, true);
