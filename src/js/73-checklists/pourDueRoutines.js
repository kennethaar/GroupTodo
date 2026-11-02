/* Every routine that falls on `day` and has not been put there yet, poured
   into `target` (the day page). Returns the titles poured. */
function pourDueRoutines(target, day) {
  const done = [];
  if (!getPage(target)) return done;
  for (const path of checklistPages()) {
    const s = routineSchedule(path);
    if (!s || (s.last && s.last >= day) || routineDates(path, day)[0] !== day) continue;
    const page = getPage(path);
    const mark = ("8/" + baseName(path)).toLowerCase();
    // Added by hand today already: that is this day's one.
    const there = getPage(target).blocks.some(b =>
      linksIn(b.title).some(l => trim(l.split("|")[0]).toLowerCase() === mark));
    if (!there) {
      applyStencil(path, target);
      const parent = getPage(target).blocks[getPage(target).blocks.length - 1];
      if (s.time) walkBlocks(parent.children, b => { if (b.state) setBlockProp(b, "SCHEDULED", whenValue(day, s.time)); });
      done.push(pageTitle(path));
    }
    page.props.last_run = "[[" + day + "]]";
    page.props.runs = String(s.runs + 1);
    touch(path);
  }
  return done;
}
