/* Other lines in the drawer stay; only the CLOCK lines are rewritten. */
function writeClockEntries(b, entries) {
  const lb = logbookOf(b);
  const rest = (lb || []).filter(l => !CLOCK_RE.test(trim(l)) && !/^:(LOGBOOK|END):$/i.test(trim(l)));
  const lines = entries.slice().sort((x, y) => x.start - y.start).map(clockLine);
  if (!lines.length && !rest.length) {
    if (lb) b.drawers.splice(b.drawers.indexOf(lb), 1);
    return;
  }
  const next = [":LOGBOOK:", ...lines, ...rest, ":END:"];
  if (lb) lb.splice(0, lb.length, ...next);
  else (b.drawers || (b.drawers = [])).push(next);
}
