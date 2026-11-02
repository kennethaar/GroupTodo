/* Port of: init.lua refile_current_task -- move a subtree to a project,
   leaving a DONE breadcrumb behind when it came from a journal. */
function refileBlock(fromPath, block, toPath) {
  const from = getPage(fromPath), to = getPage(toPath);
  if (!from || !to) return;
  removeBlockFrom(from, block);
  to.blocks.push(block);
  if (isJournalPath(fromPath)) {
    from.blocks.push(newBlock({
      state: "DONE",
      title: "Refiled: " + block.title + " -> [[" + pageRef(toPath) + "]]",
      props: {CLOSED: todayStamp()},
    }));
  }
  touch(fromPath); touch(toPath);
  notify("Refiled to " + pageTitle(toPath));
  render();
}
