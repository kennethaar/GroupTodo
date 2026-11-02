/* The day and time something written in the time box means, against the day
   the box is on: "14:30" and "kl 13" keep the day, "in 45 minutes" is from
   now, and "tomorrow 9" or "fri" are read as the line reads them. */
function whenFromBox(text, day) {
  const p = whenEnglish(trim(text).toLowerCase());
  if (!p) return {day, time: null};
  // The box only ever holds a time, so 0843 and 8.43 need no kl in front.
  const c = whenClock(p) || (/^\d{1,2}$/.test(p) ? whenClock("at " + p) : null) || readClock(p);
  if (c) return {day, time: c};
  const rel = whenFromNow(p);
  if (rel) return {day: rel.day, time: rel.time, now: true};
  const w = parseWhen("x " + trim(text));
  if (w && w.title === "x" && (w.SCHEDULED || w.DEADLINE))
    return {day: w.SCHEDULED || w.DEADLINE, time: w.time};
  return null;
}
