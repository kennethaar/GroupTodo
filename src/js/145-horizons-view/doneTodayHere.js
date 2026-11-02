/* Everything closed today, from any page, so the board's last column is not
   permanently empty. */
function doneTodayHere() {
  const out = [];
  const today = todayISO();
  for (const [path, page] of V.pages) {
    if (isArchived(path)) continue;
    walkBlocks(page.blocks, b => {
      if (b.state !== "DONE" || isMessage(b)) return;
      if (closedOn(b) !== today) return;
      out.push({path, block: b, state: "DONE", title: b.title, context: blockContext(b),
                due: dueDate(b), assignee: assigneeOf(b), project: isJournalPath(path) ? null : pageTitle(path),
                projectPath: isJournalPath(path) ? null : path});
    });
  }
  return out;
}
