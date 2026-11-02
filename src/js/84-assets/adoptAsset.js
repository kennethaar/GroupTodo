/* A line cut in one area and pasted in another still names the picture by
   its path in the first area's folder. When this area has no such file, the
   other open areas are asked, and the one that has it hands over a copy --
   which also mends lines moved before this was here. The stamp in every
   asset name keeps two different files from passing for each other. */
async function adoptAsset(path, space, be) {
  if (typeof be.putAsset !== "function") return null;
  for (const [name, rec] of LOADED) {
    if (name === space || !rec.backend || typeof rec.backend.getAsset !== "function") continue;
    let blob = null;
    try { blob = await rec.backend.getAsset(path); } catch (_) {}
    if (!blob) continue;
    try { await be.putAsset(path, blob); } catch (_) {}
    return blob;
  }
  return null;
}
