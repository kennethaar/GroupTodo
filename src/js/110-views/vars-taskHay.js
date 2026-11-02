const taskHay = a => [a.title, a.project, a.context && "@" + a.context, a.assignee, a.owner,
  a.block && blockProp(a.block, "stage")].filter(Boolean).join(" ");
const noMatch = (q, otherwise) => q ? "Nothing matches “" + q + "”." : otherwise;
/* A reading that waits until there is something for it to show. The one you
   are on always shows, so v r or a link still lands on it. */
const subShown = (view, k) => view === "review" ? k !== "reflect" || reflectWanted()
  : view !== "projects" ? true
  : k === "report" ? reportEarned() : k === "hours" ? timeLogEntries().length > 0 || sheetEntries(sheetById("clients")).length > 0 : true;
