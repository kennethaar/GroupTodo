/* {greet, w, q, both, add, bye}: each part's lines. A part the page leaves out
   keeps the standard text. */
function askOwnParts() {
  const page = V.pages.has(ASK_OWN_PATH) ? getPage(ASK_OWN_PATH) : askOwnPage(), parts = {};
  for (const b of page.blocks || []) {
    const hit = ASK_OWN_PARTS.find(([part]) => plainTitle(b.title).toLowerCase().replace(/:\s*$/, "") === part);
    if (hit) parts[hit[1]] = (b.children || []).map(k => k.title).filter(l => trim(l)).join("\n");
  }
  return parts;
}
