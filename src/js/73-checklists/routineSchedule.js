function routineSchedule(path) {
  if (!canSchedule(path)) return null;
  const props = getPage(path)?.props || {};
  const rule = parseRule(props.cadence);
  if (!rule) return null;
  const ends = trim(props.ends || "");
  const after = /^after\s+(\d+)/i.exec(ends);
  return {
    rule,
    starts: dateIn(props.starts) || dateIn(props.created) || dateIn(props.last_run),
    ends: after ? null : dateIn(ends), times: after ? Number(after[1]) : null,
    time: (/^\d{1,2}:\d{2}/.exec(trim(props.time || "")) || [""])[0],
    runs: Number(props.runs) || 0, last: dateIn(props.last_run),
  };
}
