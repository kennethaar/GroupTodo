/* ---------- every round of a chore in some days (#325) ----------
   The days it is due from `from` to `to`, so a daily chore on paper has a box
   for each day, not one for its next day only. Late and due now are always
   on, as the first round: "" for one with no day. */
function choreRoundsIn(a, from, to) {
  const spec = repeatOf(a.block), first = a.due || "";
  if (!first) return [""];
  const out = [];
  if (choreGroup(a) === "due" || (first >= from && first <= to)) out.push(first);
  let day = first, guard = 0;
  while (spec && guard++ < 400) {
    day = nextRepeatDate(spec, day);
    if (!day || day > to) break;
    if (day >= from) out.push(day);
  }
  return out;
}
