/* Files a day-page line under a project the way the outline reads it (#401):
   a line that is just the project's link, with the line indented under it.
   The day's own line for that project is used when there is one. */
function fileUnderProject(path, block, proj) {
  const page = getPage(path);
  if (!page || !proj) return false;
  const snapshot = structuredClone(page), space = V.space;
  pushUndo({run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render();
    return true;
  }});
  // A link to a project in its own words goes: the line above says it now.
  const cur = lineProject(path, block);
  if (cur && cur.ref) block.title = trim(block.title.replace(new RegExp("\\[\\[" +
    cur.ref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\]\\[[^\\]]*)?\\]\\]", "i"), "").replace(/\s{2,}/g, " "));
  const link = "[[" + pageRef(proj) + "]]";
  const parent = parentOf(page, block);
  const siblings = parent ? parent.children : page.blocks;
  const at = siblings.indexOf(block);
  const head = page.blocks.find(x => x !== block && trim(x.title || "").toLowerCase() === link.toLowerCase());
  if (head && parent === head) { touch(path); return true; }
  if (head) {
    siblings.splice(at, 1);
    head.children = [...(head.children || []), block];
    head.collapsed = false;
  } else {
    const fresh = newBlock({}, false);
    fresh.title = link;
    fresh.children = [block];
    siblings.splice(at, 1, fresh);
  }
  flattenBlocks(page.blocks);
  touch(path);
  return true;
}
