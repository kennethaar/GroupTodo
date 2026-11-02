/* What goes: active, waiting and someday projects, and completed or cancelled
   ones only once they have a card, so it can be ticked off. Years of finished
   projects are not poured into a plan nobody asked to hold them. */
function plannerProjects() {
  const out = [];
  for (const code of ["1", "3", "2", "0", "-"]) for (const path of projectsIn(code)) {
    if (isArchived(path) || isTourProject(path)) continue;
    if ((code === "0" || code === "-") && !trim(String(getPage(path)?.props?.[PLANNER_ID_PROP] || ""))) continue;
    out.push({path, space: V.space});
  }
  return out;
}
