/* On a task type's own page, every task of that type, one section per stage --
   the purchases still to order, the ones on their way, the ones that came. */
function tasksOfTypeSections(listPath) {
  const stages = stagesOf(listPath);
  const rows = [];
  for (const path of allPages(p => !isStencilPath(p))) {
    for (const b of flattenBlocks(getPage(path).blocks)) {
      if (!b.state) continue;
      const m = /\[\[([^\]]+)\]\]/.exec(blockProp(b, "stage") || "");
      if (!m || findExistingPage(m[1]) !== listPath) continue;
      rows.push({path, block: b, state: b.state, title: b.title, space: V.space,
        context: blockContext(b), due: dueDate(b), stage: stageLabel(b) || ""});
    }
  }
  if (!rows.length) return [el("div", {class: "section"}, emptyCard(
    "No tasks of this type yet. Give a task this type from its line menu (Ctrl+.), under Type."))];
  const out = [];
  for (const s of stages) {
    const mine = rows.filter(r => r.stage.toLowerCase() === s.name.toLowerCase());
    out.push(section(s.name, mine.length, taskCard(mine, "Nothing " + s.name.toLowerCase() + ".")));
  }
  const lost = rows.filter(r => !stages.some(s => s.name.toLowerCase() === r.stage.toLowerCase()));
  if (lost.length) out.push(section("No stage", lost.length, taskCard(lost)));
  return out;
}
