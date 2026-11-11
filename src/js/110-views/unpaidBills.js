/* The payments still waited for: open WAITs that markBilled wrote, with
   payment:: on them, oldest due first. */
function unpaidBills() {
  return acrossSpaces(() => allTasksHere().filter(t => t.state === "WAIT" && blockProp(t.block, "payment"))
    .map(t => ({block: t.block, path: t.path, space: V.space, title: t.title, due: t.due})))
    .sort((a, b) => (a.due || "9").localeCompare(b.due || "9"));
}
