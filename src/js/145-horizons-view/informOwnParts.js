function informOwnParts() {
  const parts = {};
  if (!V.pages.has(INFORM_OWN_PATH)) return parts;
  for (const b of getPage(INFORM_OWN_PATH).blocks || []) {
    const hit = INFORM_OWN_PARTS.find(([part]) => plainTitle(b.title).toLowerCase().replace(/:\s*$/, "") === part);
    if (hit) parts[hit[1]] = (b.children || []).map(k => k.title).filter(l => trim(l)).join("\n");
  }
  return parts;
}
