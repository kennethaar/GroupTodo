/* A step due after the task it is a step of cannot be done in time. Told once,
   when the date that makes it so is set; the date stays as given. Only dates
   written on the lines count: an inherited one moves with its parent. */
function warnDueConflict(path, block) {
  const page = getPage(path), due = dueDate(block);
  if (!page || !due || (block.state && !OPEN_STATES[block.state])) return false;
  flattenBlocks(page.blocks);
  const open = b => !b.state || OPEN_STATES[b.state];
  for (let p = block._parent; p; p = p._parent) {
    const d = open(p) && dueDate(p);
    if (d && d < due) {
      notify("“" + block.title + "” is due " + humanDate(due) + ", after “" + p.title + "” (" + humanDate(d) + ").", "warn");
      return true;
    }
  }
  const late = [];
  walkBlocks(block.children, b => { const d = b.state && open(b) && dueDate(b); if (d && d > due) late.push(b); });
  if (!late.length) return false;
  notify((late.length === 1 ? "“" + late[0].title + "” is due " + humanDate(dueDate(late[0]))
                            : late.length + " steps are due") + " after " + humanDate(due) + ", the date of “" + block.title + "”.", "warn");
  return true;
}
