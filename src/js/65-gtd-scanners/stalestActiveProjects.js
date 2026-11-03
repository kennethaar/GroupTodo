/* Stalest active projects. Missing context beats missing verb beats plain age. */
function stalestActiveProjects(n = CFG.weedCount) {
  const rows = [];
  for (const path of projectsIn("1")) {
    if (isStandIn(path)) continue;            // its file is not in yet
    const page = getPage(path);
    const todos = [];
    let noContext = false, noVerb = false, anyTodo = false;
    for (const b of flattenBlocks(page.blocks)) {
      if (!OPEN_STATES[b.state]) continue;
      anyTodo = true;
      const ctx = blockContext(b);
      const missingVerb = !startsWithVerb(b.title);
      if (!ctx) noContext = true;
      if (missingVerb) noVerb = true;
      todos.push({path, block: b, state: b.state, title: b.title,
                  context: ctx, missingContext: !ctx, missingVerb});
    }
    const createdDate = dateIn(page.props?.created);
    const reviewedDate = dateIn(page.props?.reviewed);
    const ageDays = createdDate ? dateDiffDays(createdDate, todayISO()) : null;
    const idleDays = reviewedDate ? dateDiffDays(reviewedDate, todayISO())
                   : (ageDays ?? 3650);
    let bias = 0;
    if (!anyTodo)  bias += 1500;
    if (noContext) bias += 1000;
    if (noVerb)    bias += 500;
    rows.push({path, title: pageTitle(path), todos, anyTodo, noContext, noVerb,
               ageDays, createdDate, reviewedDate, idleDays, score: bias + (idleDays || 0)});
  }
  rows.sort((a, b) => b.score - a.score);
  return rows.slice(0, n);
}
