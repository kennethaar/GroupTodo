/* A picture this area does not have yet is kept; one it has is left alone --
   the names carry a stamp, so the same name is the same picture. */
async function mergeBundleAssets(text) {
  const be = V.backend;
  const pics = parseBundleAssets(text);
  if (!pics.size || !be || typeof be.putAsset !== "function") return 0;
  let n = 0;
  for (const [path, {type, b64}] of pics) {
    if (!/^assets\/[^/]+$/.test(path)) continue;
    try {
      if (await be.getAsset(path)) continue;
      const bin = atob(b64), bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      await be.putAsset(path, new Blob([bytes], {type}));
      n++;
    } catch (_) { /* a damaged picture does not stop the pages */ }
  }
  return n;
}
