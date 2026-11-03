/* Journal lines that name a project. The line lives in somebody's day page,
   but the project is what it belongs to -- so a project started by writing
   [[1/Userflow]] in a task reads as having that task, rather than looking
   empty. Indexed under both the link's own ref and its bare title, which is how
   nearestProjectAncestor finds them written. */
function journalActionsIndex() {
  // Per area: it is read from inside inSpace() as well, and one area's index is no use to another.
  return memo("journalActionsIndex:" + (V.space || ""), () => {
    const by = new Map();
    const add = (key, row) => {
      if (!key) return;
      const list = by.get(key) || [];
      if (!list.includes(row)) list.push(row);
      by.set(key, list);
    };
    for (const path of allJournals()) {
      const page = getPage(path); if (!page || isArchived(path)) continue;
      for (const b of flattenBlocks(page.blocks)) {
        if (!b.state || isMessage(b) || hasOpenDescendant(b)) continue;
        const link = nearestProjectAncestor(b); if (!link) continue;
        const row = {path, block: b, state: b.state, title: b.title,
                     context: blockContext(b), due: effectiveDue(b),
                     age: blockAge(b) ?? dateDiffDays(journalDate(path), todayISO()),
                     added: addedDate(b) || journalDate(path),
                     assignee: assigneeOf(b), by: blockProp(b, "by"),
                     owner: journalOwnerOf(path) || null,
                     missingVerb: !startsWithVerb(b.title),
                     missingContext: !blockContext(b)};
        add(link.ref.toLowerCase(), row);
        add(link.title.toLowerCase(), row);
      }
    }
    return by;
  });
}
