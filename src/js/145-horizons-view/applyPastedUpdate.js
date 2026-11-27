/* Apply a pasted update (#373 reopened): the state they gave, a date they
   gave as the due date, their words as a note in their name, Got it as
   acknowledged::. One Undo, on the toast or Ctrl+Z, puts every page back. */
function applyPastedUpdate(u) {
  const at = nowStamp(), was = [];
  for (const {hit} of u.rows) {
    const space = hit.space || V.space;
    if (!was.some(w => w.space === space && w.path === hit.path))
      was.push({space, path: hit.path, page: inSpace(space, () => structuredClone(getPage(hit.path)))});
  }
  const back = () => {
    for (const w of was) inSpace(w.space, () => {
      if (!getPage(w.path)) return;
      Object.assign(getPage(w.path), structuredClone(w.page));
      touch(w.path);
    });
    render();
    return true;
  };
  for (const r of u.rows) inSpace(r.hit.space, () => {
    const {path, block} = r.hit;
    if (r.done) setBlockState(path, block, "DONE");
    if (r.due) setDue(block, r.due);
    if (r.note) postMessageAs(path, block, r.note, u.who, at);
    if (r.ack) setBlockProp(block, ACK_PROP, u.who + " " + at);
    touch(path);
  });
  pushUndo({run: back});
  // One Undo for the whole update: not a second one for the task marked done.
  if (u.rows.some(r => r.done)) closeDoneToast();
  render();
  const n = u.rows.length;
  notify("Updated " + (n === 1 ? "1 task" : n + " tasks") + " from " + u.who + ".", "info", {label: "Undo", run: back});
}
