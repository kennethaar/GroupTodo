/* Finished last week, ticked off today: the day it was done moves back, on the
   same stamps the tick wrote -- CLOSED::, done_by:: and the end of Added:: on a
   todo, completed:: on a project -- so the Report counts it on the right day.
   Only a date the tick wrote today is moved; one written another way stays. */
function backdateDone(e, day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day || "") || day > todayISO()) return false;
  const ok = inSpace(e.space, () => {
    const t = doneTarget(e);
    if (!t) return false;
    const from = e.day, swap = v => String(v || "").split(from).join(day);
    if (t.block) {
      const closed = blockProp(t.block, "CLOSED");
      if (closed && closed.includes(from)) setBlockProp(t.block, "CLOSED", swap(closed));
      // done_by:: is a UTC time, whose day can be tomorrow's late in the evening.
      const by = blockProp(t.block, "done_by");
      if (by) setBlockProp(t.block, "done_by", by.replace(/\d{4}-\d{2}-\d{2}/, day));
      const raw = blockProp(t.block, "Added") || "", added = addedDate(t.block);
      if (added && raw.includes("- [[" + from + "]]"))
        setBlockProp(t.block, "Added", raw.replace(/\s*-\s*\[\[\d{4}-\d{2}-\d{2}\]\].*$/, "")
          + " - [[" + day + "]] = " + Math.max(0, dateDiffDays(added, day) ?? 0) + " days");
    } else if (String(t.page.props.completed || "").includes(from)) {
      t.page.props.completed = swap(t.page.props.completed);
    }
    touch(t.path);
    return true;
  });
  if (!ok) { notify("Could not find " + e.label + " any more. It may have been renamed or deleted.", "warn"); return false; }
  e.day = day;
  PREF.set("done.history", JSON.stringify(doneHistory().map(x => x.at === e.at ? Object.assign(x, {day}) : x)));
  render();
  return true;
}
