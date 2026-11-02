function openRoutineSchedule(path) {
  const props = getPage(path)?.props || {};
  openRecurrenceDialog({
    title: "When " + pageTitle(path) + " comes round",
    spec: parseRule(props.cadence) ? props.cadence : "",
    starts: dateIn(props.starts), ends: trim(props.ends || ""), time: trim(props.time || ""),
    schedule: true,
    onSave: v => {
      saveRoutineSchedule(path, v);
      const n = parseRule(v.spec) ? pourTodaysRoutines(ensureJournal(todayISO())) : 0;
      if (!n) notify(parseRule(v.spec) ? "Comes onto your day page " + routineSummary(path).replace(/ · next /, ", next on ") + "."
                                       : "Comes round as needed: add it to a page when it does.");
      render();
    },
  });
}
