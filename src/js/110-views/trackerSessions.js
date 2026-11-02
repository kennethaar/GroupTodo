/* Weight and sets (kr, krr, krrr...): one pillar per session, as tall as the
   weight with the kilos written in it, and the reps of each set as dots on
   their own scale, set 1 joined to set 1 the next time and so on. Only the
   days you trained are on it, side by side: a skipped day is not a zero, and
   a set left empty is stepped over, so neither pulls a line down. */
function trackerSessions(g) {
  const by = new Map();
  for (const e of g.entries) {
    const slots = trackerSlots(e);
    let kg = null; const reps = [];
    slots.forEach((L, i) => {
      const x = trackerNum(e.values[i]);
      if (L === "k" && kg == null) kg = x;
      else if (L === "r") reps.push(x);
    });
    if (kg == null && !reps.some(r => r != null)) continue;
    const prev = by.get(e.date);
    // Two lines on one day: the heavier one is the session.
    if (!prev || (kg || 0) > (prev.kg || 0)) by.set(e.date, {date: e.date, e, kg, reps});
  }
  return [...by.values()].sort((a, b) => a.date.localeCompare(b.date));
}
