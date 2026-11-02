/* What you ticked off in the days, from any page: dated, and yours. */
function weekDoneHere(first, last) {
  const out = [], me = whoAmI();
  for (const [path, page] of V.pages) {
    if (isArchived(path) || isStencilPath(path)) continue;
    const owner = isJournalPath(path) ? journalOwnerOf(path) : "";
    walkBlocks(page.blocks, b => {
      if (b.state !== "DONE" || isMessage(b)) return;
      const d = taskEnd(b);
      if (!d || d < first || d > last) return;
      const who = assigneeOf(b, page);
      if (who ? !samePerson(who, me) : owner && owner !== journalOwner()) return;
      out.push({path, block: b, state: "DONE", title: b.title, context: blockContext(b)});
    });
  }
  return out;
}
