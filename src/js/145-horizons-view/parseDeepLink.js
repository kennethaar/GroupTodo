function parseDeepLink(hash) {
  const h = String(hash || "").replace(/^#/, "");
  if (h.slice(0, LINK_TAG.length) !== LINK_TAG) return null;
  const q = new URLSearchParams(h.slice(LINK_TAG.length).replace(/^&/, ""));
  const path = q.get("p");
  return path ? {space: q.get("s") || "", path, block: q.get("b") || ""} : null;
}
