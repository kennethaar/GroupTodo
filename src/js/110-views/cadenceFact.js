/* A routine's cadence as a pill that says when it next comes round, and opens
   the dialog that sets it. Typed, the line is the plain words. */
function cadenceFact(path) {
  const v = trim(getPage(path)?.props?.cadence || "");
  const on = !!routineSchedule(path);
  return {
    key: "cadence", raw: "cadence:: " + v,
    save: text => saveRawProp(path, "cadence", text),
    pills: () => [factPill(routineSummary(path), on ? "fok" : "fquiet",
      on ? "Comes onto your day page by itself on these days. Click to change it."
         : "Click to have it come onto your day page by itself",
      () => openRoutineSchedule(path))],
  };
}
