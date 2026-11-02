/* The clocks on the todos of projects, each under the project's clients: the
   organisations its page or its area names (org::) that are not suppliers,
   shared out by clientShares when there are several. Your own todos and the
   ones nobody has; a todo somebody else was given is theirs to count. */
function clientEntries() {
  return memo("clientClock", () => acrossSpaces(() => {
    const out = [];
    for (const t of allTasksHere()) {
      if (!logbookOf(t.block)) continue;
      const proj = t.projectPath && pageKind(t.projectPath) === "project" ? t.projectPath : null;
      if (!proj || (t.assignee && !isMe(t.assignee))) continue;
      const shares = clientShares({space: V.space, path: proj});
      const to = shares.length ? shares : [{name: "No client", pct: 100}];
      for (const c of blockClocks(t.block)) for (const {name, pct} of to)
        out.push({date: c.day, name, value: c.min * pct / 100, open: c.open, stale: c.stale,
          project: pageTitle(proj), projectPath: proj, space: V.space});
    }
    return out;
  }).sort((a, b) => a.date.localeCompare(b.date)));
}
