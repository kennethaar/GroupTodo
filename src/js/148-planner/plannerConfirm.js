/* The flow applied an outbox: remember what each card now holds, and write
   the IDs of new cards onto their project pages. A project renamed or moved
   since is found again by its name. */
function plannerConfirm(outbox, state, sent) {
  const created = new Map((state.created || []).map(x => [x.key, x.id]));
  sent.cards = sent.cards || {};
  for (const t of outbox.tasks || []) {
    const id = t.id || created.get(t.key);
    if (!id) continue;
    sent.cards[id] = {hash: t.hash, assignees: t.assignees || [], checklist: (t.checklist || []).map(i => i.id)};
    if (t.id) continue;
    const path = V.pages.has(t.key) ? t.key : findExistingPage(baseName(t.key));
    const page = path && getPage(path);
    if (!page) continue;
    page.props = page.props || {};
    page.props[PLANNER_ID_PROP] = id;
    touch(path);
  }
  sent.applied = outbox.seq;
}
