/* Port of: init.lua refile_current_task -- move a subtree to a project,
   leaving a DONE breadcrumb behind when it came from a journal. */
function refileBlock(fromPath, block, toPath) {
  const from = getPage(fromPath), to = getPage(toPath);
  if (!from || !to) return;
  if (putsBack(toPath)) for (const [k, v] of Object.entries(rememberPlace(fromPath, block))) if (v) setBlockProp(block, k, v);
  removeBlockFrom(from, block);
  to.blocks.push(block);
  if (isJournalPath(fromPath)) {
    /* A link to the page the line now sits on tells nothing there, so it
       points back to the day it was written on instead, and the breadcrumb
       leaves it out (#384). Other links stay. */
    const toDest = new RegExp(LINK_RE.source, "g");
    const words = block.title.replace(toDest, (m, ref) => findExistingPage(trim(ref)) === toPath ? "\u0000" : m);
    const crumb = trim(words.replace(/\s*\u0000/g, "").replace(/ {2,}/g, " "));
    if (words !== block.title) {
      let first = true;
      block.title = trim(words.replace(/\s*\u0000/g, () => first ? (first = false, " [[" + pageRef(fromPath) + "]]") : "")).replace(/ {2,}/g, " ");
    }
    from.blocks.push(newBlock({
      state: "DONE",
      title: "Refiled: " + crumb + " -> [[" + pageRef(toPath) + "]]",
      props: {CLOSED: todayStamp()},
    }));
  }
  touch(fromPath); touch(toPath);
  notify("Refiled to " + pageTitle(toPath));
  render();
}
