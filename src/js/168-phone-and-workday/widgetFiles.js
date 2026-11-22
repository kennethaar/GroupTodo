/* Every context's widget file in one area, parents and sub contexts alike:
   its next actions as in Next (no waiting-for, someday or held), a parent's
   with its sub contexts', overdue and due today first, at most WIDGET_MAX.
   And which line is which, for the ticks to find their way back (#474). */
function widgetFiles(rec) {
  const today = todayISO();
  const acts = nextActions().filter(a => (a.space || V.space) === rec.name);
  const ctxs = new Set();
  for (const p of rec.pages.keys()) if (isContextPath(p)) ctxs.add(ctxNameOf(p));
  for (const a of acts) if (a.context) ctxs.add(a.context);
  for (const c of [...ctxs]) {
    const s = c.split("/");
    for (let i = 1; i < s.length; i++) ctxs.add(s.slice(0, i).join("/"));
  }
  const soon = a => a.due && a.due <= today ? a.due : "9999-99-99";
  const files = new Map(), ids = {};
  for (const ctx of [...ctxs].sort()) {
    const rows = acts.filter(a => inContext(a, ctx, true))
      .sort((x, y) => soon(x).localeCompare(soon(y)))
      .slice(0, WIDGET_MAX).map(a => ({a, t: widgetLine(a, ctx)}));
    const {file, head} = widgetName(ctx);
    files.set(file, [head, "", ...(rows.length ? rows.map(r => "- [ ] " + r.t) : ["Nothing to do here right now."]), ""].join("\n"));
    ids[file] = rows.map(r => ({t: r.t, p: r.a.path, k: r.a.block.title}));
  }
  return {files, ids};
}
