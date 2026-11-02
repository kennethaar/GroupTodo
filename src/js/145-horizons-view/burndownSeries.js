function burndownSeries(from, to, space) {
  const spans = taskSpans().filter(s => !space || (s.space || "") === space);
  const days = [];
  for (let d = from, guard = 0; d <= to && guard < 800; d = shiftISO(d, 1), guard++) days.push(d);
  return days.map(day => {
    let open = 0, added = 0, done = 0;
    for (const s of spans) {
      if (s.added <= day && (!s.closed || s.closed > day)) open++;
      if (s.added === day) added++;
      if (s.closed === day) done++;
    }
    return {day, open, added, done};
  });
}
