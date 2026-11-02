/* The chip under a visit: its clock and its sum, and the way back into the form. */
function timeLogChip(b, path) {
  const date = path && dayOfPath(path);
  const a = trim(blockProp(b, "in") || ""), z = trim(blockProp(b, "out") || "");
  const m = timeLogMinutes(b, date), open = timeLogOpen(b);
  const stale = open && date && date < todayISO();
  const label = "\u{1F552} " + (stale ? "in " + a + " · no time out"
    : open ? "in since " + a + (m ? " · " + fmtMinutes(m) : "")
    : (a ? a + "–" + z + " · " : "") + fmtMinutes(m));
  return el("button", {class: "chip" + (stale ? " late" : open ? " today" : ""),
    title: open ? "Still there. Click to check out" : "Click to change",
    onmousedown: e => e.preventDefault(),
    onclick: e => { e.stopPropagation(); if (path) openTimeForm(path, b, {leaving: open}); }}, label);
}
