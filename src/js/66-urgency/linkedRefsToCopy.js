/* ---------- the linked references, copied onto the page ----------
   What a project gathered is scattered over the day pages that named it.
   This copies each line that links here, with what is under it, to the
   bottom of the page, under the page it came from. The originals stay where
   they are, and a line copied once (copied_from:: its id) is not copied again. */
function linkedRefsToCopy(path) {
  const done = new Set();
  walkBlocks(getPage(path)?.blocks || [], b => { const c = trim(blockProp(b, "copied_from") || ""); if (c) done.add(c); });
  // A page's own key:: value naming this one is a fact about that page, not a line to copy.
  return (backlinksTo(path) || []).filter(h => h.trail && !done.has(trim(blockProp(h.block, "id") || "")));
}
