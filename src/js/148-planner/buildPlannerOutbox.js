/* Only the cards that changed since the flow last confirmed them. `sent` is
   planner/sent.json: per Planner ID, what that card was last given. */
function buildPlannerOutbox(sent, seq) {
  const cards = plannerProjects().map(plannerCard);
  const tasks = [];
  for (const c of cards) {
    const hash = plannerHashOf(c);
    const was = c.id ? (sent.cards || {})[c.id] : null;
    if (was && was.hash === hash) continue;
    const t = {op: c.id ? "update" : "create", key: c.key};
    if (c.id) t.id = c.id;
    Object.assign(t, {title: c.title, bucket: c.bucket, progress: c.progress, percentComplete: c.percentComplete,
      start: c.start, due: c.due, assignees: c.assignees,
      assigneesRemove: was ? (was.assignees || []).filter(e => !c.assignees.includes(e)) : [],
      notes: c.notes, checklist: c.checklist,
      checklistRemove: was ? (was.checklist || []).filter(id => !c.checklist.some(i => i.id === id)) : [],
      hash});
    tasks.push(t);
  }
  return {
    outbox: {format: PLANNER_FORMAT, experimental: true, seq, written: new Date().toISOString(),
      area: V.space || "", by: whoAmI(), notesDivider: PLANNER_DIVIDER,
      buckets: [...new Set(cards.map(c => c.bucket))].sort((a, b) => a.localeCompare(b)), tasks},
    missing: [...new Set(cards.flatMap(c => c.missing))].sort(),
  };
}
