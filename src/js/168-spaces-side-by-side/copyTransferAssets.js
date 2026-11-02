/* Attachments a page links to are copied into the target space's asset folder.
   One already there under the same name has to be the same file. */
async function copyTransferAssets(page, from, to) {
  const paths = new Set();
  for (const m of serializePage(page).matchAll(/\]\(([^)]+)\)/g))
    if (m[1].startsWith(ASSET_DIR + "/")) paths.add(m[1]);
  const source = LOADED.get(from).backend, dest = LOADED.get(to).backend;
  for (const path of paths) {
    const blob = await source.getAsset(path);
    if (!blob) throw new Error("Attachment missing: " + path);
    const existing = await dest.getAsset(path);
    if (!existing) { await dest.putAsset(path, blob); continue; }
    if (existing.size !== blob.size || await existing.text() !== await blob.text())
      throw new Error("Attachment conflict: " + path);
  }
}
