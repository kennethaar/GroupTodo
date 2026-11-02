function calNoteGone(path, page) {
  if (!path.startsWith(JOURNALS + "/")) return;
  const was = page._cal, now = calKeysOn(page);
  calRemember(page, now);
  const before = calSkips(page), skip = new Set(before);
  if (was && !CAL_OWN_EDIT) for (const [k, look] of was) if (!now.has(k)) { skip.add(k); skip.add(look); }
  for (const [k, look] of now) { skip.delete(k); skip.delete(look); }
  if (skip.size === before.size && [...skip].every(k => before.has(k))) return;
  if (skip.size) page.props.cal_deleted = [...skip].join(" ");
  else delete page.props.cal_deleted;
}
