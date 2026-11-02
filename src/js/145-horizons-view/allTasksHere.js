/* Every task in the areas on screen, open or not, wherever it is written: what
   a plan's export to Excel holds in Planner. */
function allTasksHere() {
  const out = [];
  for (const [path, page] of V.pages) {
    if (isStencilPath(path)) continue;
    const journal = isJournalPath(path);
    for (const b of flattenBlocks(page.blocks)) {
      if (!b.state || isMessage(b)) continue;
      const linked = journal ? nearestProjectAncestor(b) : null;
      out.push({path, block: b, state: b.state, title: b.title,
        project: journal ? (linked ? linked.title : null) : pageTitle(path),
        projectPath: journal ? (linked ? findExistingPage(linked.ref) : null) : path,
        context: blockContext(b), due: dueDate(b), assignee: assigneeOf(b, page),
        by: blockProp(b, "by"), owner: journalOwnerOf(path) || null,
        added: addedDate(b) || (journal ? baseName(path) : null)});
    }
  }
  return out;
}
