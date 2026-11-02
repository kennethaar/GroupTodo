// Start: the earliest SCHEDULED:: in it. Due: the project's deadline::, else the last open DEADLINE::.
function plannerDates(path) {
  const page = getPage(path);
  let start = null, last = null;
  walkBlocks(page?.blocks || [], b => {
    if (!b.state || isMessage(b)) return;
    const s = dateIn(blockProp(b, "SCHEDULED"));
    if (s && (!start || s < start)) start = s;
    const d = dateIn(blockProp(b, "DEADLINE"));
    if (d && OPEN_STATES[b.state] && (!last || d > last)) last = d;
  });
  return {start, due: dateIn(page?.props?.deadline || page?.props?.due || "") || last};
}
