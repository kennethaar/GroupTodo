function relAll() {
  return acrossSpaces(() => {
    const rows = [];
    for (const path of allPages()) {
      const page = getPage(path);
      if (!isJournalPath(path) && pageKind(path) !== "verb") rows.push({path, space: V.space});
      walkBlocks(page.blocks, b => {
        if (!b.state || isMessage(b)) return;
        rows.push({path, space: V.space, block: b, state: b.state, title: b.title,
          context: blockContext(b), due: dueDate(b), age: blockAge(b), assignee: assigneeOf(b)});
      });
    }
    return rows;
  });
}
