/* A project as a stakeholder reads it: where it stands, what is next, what was
   done since they were last told, and what is late or waiting. Active and
   waiting projects, on hold or not, and those finished since; someday is not
   a commitment yet, so it is not reported. */
function projectSummary(space, path, since) {
  return inSpace(space, () => {
    const r = {space, path};
    const code = projectHold(path) ? "hold" : effStatus(r);
    const acts = projectActions(r);
    const open = acts.filter(a => OPEN_STATES[a.state]).sort(byUrgency);
    const next = open.find(a => a.state !== "WAIT" && a.mine) || open.find(a => a.state !== "WAIT");
    const line = (label, a) => ({depth: 0, label, text: askUntagged(a.title)});
    return {space, path, title: pageTitle(path), code, lines: [
      ...(next ? [line("next", next)] : []),
      // Ticked-off steps are no longer actions; the Planner card reads them the same way, page and day pages both.
      ...plannerSteps(r).filter(a => a.state === "DONE" && (closedOn(a.block) || "") >= since).map(a => line("done", a)),
      // A late next action is said twice: that the next step is overdue is the news.
      ...open.filter(a => a.due && a.due < todayISO()).map(a => line("late", a)),
      ...open.filter(a => a.state === "WAIT").map(a => line("wait", a)),
    ]};
  });
}
