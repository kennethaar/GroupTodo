async function saveAsset(file) {
  const be = V.backend;
  if (!be || typeof be.putAsset !== "function") throw new Error("this area has nowhere to keep files");
  let path = join(ASSET_DIR, assetFileName(file));
  // Two drops in the same second with the same name: keep both.
  if (await be.getAsset(path)) {
    const dot = path.lastIndexOf(".");
    path = path.slice(0, dot) + "-" + Math.random().toString(36).slice(2, 6) + path.slice(dot);
  }
  await be.putAsset(path, file);
  const key = (V.space || "") + "|" + path;
  const old = ASSET_URLS.get(key);
  if (old) { try { URL.revokeObjectURL(old); } catch (_) {} ASSET_URLS.delete(key); }
  return path;
}
