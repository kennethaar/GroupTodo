/* /out: the line it was typed on when that is a visit, else the visit still
   open -- asked which when more than one is. */
function timeLogLeave(from) {
  if (from && isTimeLog(from.block)) { openTimeForm(from.path, from.block, {leaving: true}); return; }
  const open = timeLogEntries().filter(e => e.space === V.space && timeLogOpen(e.block)).reverse();
  if (!open.length) { notify("Nobody is checked in. /in writes it when somebody comes.", "warn"); return; }
  const pick = e => openTimeForm(e.path, e.block, {leaving: true, from});
  if (open.length === 1) { pick(open[0]); return; }
  listPicker({title: "Who is leaving?", items: open,
    label: e => e.who || "Somebody",
    detail: e => [e.project, "in " + blockProp(e.block, "in"), e.date === todayISO() ? "" : humanDate(e.date)]
      .filter(Boolean).join(" · "),
    onPick: pick});
}
