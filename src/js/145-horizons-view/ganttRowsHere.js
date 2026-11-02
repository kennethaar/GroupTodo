function ganttRowsHere() {
  const out = [];
  for (const [path, page] of V.pages) {
    if (isStencilPath(path)) continue;
    const journal = isJournalPath(path);
    const day = journal ? baseName(path) : null;
    const tasks = [];
    walkBlocks(page.blocks, b => {
      if (!b.state || isMessage(b)) return;
      const span = spanOf(b, day);
      tasks.push({path, block: b, title: b.title, state: b.state, span,
                  assignee: assigneeOf(b), project: journal ? null : pageTitle(path)});
    });
    if (!tasks.length) continue;
    out.push({path, journal, label: journal ? chatDayLabel(day) : pageTitle(path), tasks,
              project: !!statusDirOf(path),
              deps: statusDirOf(path) ? dependsOn(path) : [],
              blockers: statusDirOf(path) ? blockersOf(path) : [],
              trouble: statusDirOf(path) ? chainTrouble(path) : null});
  }
  return out;
}
