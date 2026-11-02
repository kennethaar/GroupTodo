async function writeMirror(rec, paths) {
  if (mirrorMode(rec) === "off") return;
  const m = mirrorFor(rec);
  for (const path of paths) {
    const page = rec.pages.get(path);
    try { if (page) await m.write(path, serializePage(page)); } catch (_) {}
  }
}
