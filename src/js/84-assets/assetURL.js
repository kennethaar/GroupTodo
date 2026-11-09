async function assetURL(path, space) {
  const key = (space || V.space || "") + "|" + path;
  if (ASSET_URLS.has(key)) return ASSET_URLS.get(key);
  const rec = space ? LOADED.get(space) : null;
  const be = space ? (rec && rec.backend) : V.backend;
  if (!be || typeof be.getAsset !== "function") return null;
  const blob = (await be.getAsset(path)) || await adoptAsset(path, space || V.space, be);
  if (!blob) return null;
  // A browser draws a PDF in a frame only when the file says it is one (#331).
  const typed = !blob.type && PDF_RE.test(path) ? new Blob([blob], {type: "application/pdf"}) : blob;
  const url = URL.createObjectURL(typed);
  ASSET_URLS.set(key, url);
  return url;
}
