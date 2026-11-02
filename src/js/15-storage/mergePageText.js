/* A page as this device has it, merged with the file as it is now, against
   the file as this device last saw it. The page's fields merge one by one;
   where both sides changed one, the side edited last wins it. */
function mergePageText(path, baseText, diskText, ourText) {
  const base = parsePage(baseText || ""), disk = parsePage(diskText), ours = parsePage(ourText);
  const newer = (disk.props.updated || "") > (ours.props.updated || "");
  const props = {};
  for (const k of new Set([...Object.keys(ours.props), ...Object.keys(disk.props)])) {
    const b = base.props[k], o = ours.props[k], d = disk.props[k];
    const v = o === b ? d : d === b ? o : newer ? (d ?? o) : (o ?? d);
    if (v != null) props[k] = v;
  }
  const lines = p => serializeBlockLines(p.blocks || [], 0);
  const m = mergeLines(lines(base), lines(ours), lines(disk));
  let page = parsePage(m.lines.join("\n"));
  page.props = props;
  // A line both changed -- ticked here, a field added there -- comes out once (#221).
  page.blocks = dedupeBlocks(page.blocks, repeatedKeys(ours.blocks));
  if (isJournalPath(path)) page = calMergeDeleted(page, ours, disk);
  calRemember(page, calKeysOn(page));
  return {page, clashes: m.clashes};
}
