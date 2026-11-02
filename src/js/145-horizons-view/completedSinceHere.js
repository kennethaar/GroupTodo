function completedSinceHere(from) {
  const out = [];
  for (const [path, page] of V.pages) {
    if (isStencilPath(path) || isArchived(path)) continue;
    // Flattened rather than walked, because the customer is looked for up the
    // bullets above a task and that needs each block's parent.
    for (const b of flattenBlocks(page.blocks)) {
      if (b.state !== "DONE" || isMessage(b)) continue;
      const journal = isJournalPath(path);
      /* No stamp -- marked DONE by hand, or before stamping existed. On a day
         page the day itself is a fair answer: the task was written that day and
         most likely closed within a few. It is marked approximate wherever it
         shows, so it never passes for a recorded date. A loose page has no day
         to go by, and stays undated. */
      const stamped = closedOn(b);
      const approx = !stamped && journal && /^\d{4}-\d{2}-\d{2}$/.test(baseName(path));
      const when = stamped || (approx ? baseName(path) : null);
      const linked = journal ? nearestProjectAncestor(b) : null;
      const projectPath = journal ? (linked ? findExistingPage(linked.ref) : null) : path;
      out.push({
        path, block: b, state: "DONE", title: b.title,
        when, undated: !when, approx,
        who: closedBy(b) || journalOwnerOf(path) || "",
        context: blockContext(b), due: dueDate(b), assignee: assigneeOf(b),
        org: orgOfBlock(path, b, projectPath),
        project: journal ? (linked ? linked.title : null) : pageTitle(path),
        projectPath,
      });
    }
  }
  return out.filter(r => r.undated || r.when >= from);
}
