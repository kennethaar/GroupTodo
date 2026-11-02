/* Only where there is a real folder to look at: a chosen folder or the sync
   server. Browser storage has no Explorer to get lost in. */
async function ensureGuides(record, files) {
  const b = record.backend;
  if (!b || !b.writable || !(b.kind === "fs" || b.kind === "http")) return;
  for (const [dir, code, name, about] of GUIDE_FOLDERS) {
    const path = join(dir, guideFileName(code, name));
    const have = files.get(path);
    const ver = have ? Number((/guide (\d+)\./.exec(have) || [])[1] || 0) : -1;
    if (ver >= GUIDE_VERSION) continue;
    try { await b.write(path, guideText(dir, code, name, about)); } catch (_) { return; }
  }
}
