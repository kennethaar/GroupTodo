function journalActionsFor(projectPath) {
  const by = journalActionsIndex();
  const out = [];
  for (const key of [pageRef(projectPath), baseName(projectPath), pageTitle(projectPath)]) {
    for (const row of by.get(String(key || "").toLowerCase()) || []) {
      if (!out.includes(row)) out.push(row);
    }
  }
  return out;
}
