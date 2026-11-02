async function bundleAssetsMarkdown(phone = onPhone()) {
  const be = V.backend;
  if (!be || typeof be.getAsset !== "function") return "";
  const since = Date.now() - BUNDLE_ASSET_DAYS * 864e5, out = [];
  for (const path of linkedAssetPaths()) {
    // Its name already says it is old: not even opened.
    if (!phone && assetTime(path) && assetTime(path) < since) continue;
    let blob = null;
    try { blob = await be.getAsset(path); } catch (_) {}
    if (!blob) continue;
    if (!phone && assetTime(path, blob) < since) continue;
    const key = (V.space || "") + "|" + path + "|" + blob.size;
    let b64 = ASSET_B64.get(key);
    if (b64 == null) { b64 = await blobBase64(blob); ASSET_B64.set(key, b64); }
    out.push("<!-- gtd:asset " + path + " " + (blob.type || "application/octet-stream") + " -->",
             ...(b64.match(/.{1,76}/g) || []), "<!-- gtd:endasset -->", "");
  }
  return out.join("\n");
}
