/* Writes one page, merged first with whatever another device put in its file.
   False when a merge is due but you are typing: swapping the page under the
   line being edited would lose the line, so it waits for the next save. */
async function writePageChecked(rec, path, page, merged) {
  const b = rec.backend;
  let text = serializePage(page);
  if (MERGED_KINDS.has(b.kind) && b.readText) {
    const now = await b.readText(path);
    const base = rec.base ? rec.base.get(path) : undefined;
    if (now != null && now !== base && now !== text) {
      if (busyEditing()) return false;
      const m = mergePageText(path, base, now, text);
      rec.pages.set(path, m.page);
      text = serializePage(m.page);
      merged.push({path, clashes: m.clashes});
    }
    /* The file already says this: writing it again changes nothing but its
       date, and a sync app carries every such write to the other devices (#340). */
    if (now === text) {
      noteBase(rec, path, text);
      if (rec.pages.get(path)) PAGE_SRC.set(rec.pages.get(path), text);
      return true;
    }
  }
  await b.write(path, text);
  noteBase(rec, path, text);
  if (rec.pages.get(path)) PAGE_SRC.set(rec.pages.get(path), text);
  return true;
}
