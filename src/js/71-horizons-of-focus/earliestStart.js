/* The day this project is free to start: the day after its last prerequisite
   ends. Null when nothing comes first. Uses the same span the timeline draws,
   so the number on the page and the bar on the chart cannot disagree. */
function earliestStart(path) {
  let latest = null;
  for (const p of dependsOn(path)) {
    const end = projectEnd(p);
    if (end && (!latest || end > latest)) latest = end;
  }
  return latest ? shiftISO(latest, 1) : null;
}
