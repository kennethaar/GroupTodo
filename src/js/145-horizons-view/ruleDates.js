/* The days the rule falls on, from `from` on (that day included), at most `count`. */
function ruleDates(r, anchor, from, count = 1) {
  const out = [];
  let day = from < anchor ? anchor : from;
  for (let i = 0; i < 4000 && out.length < count; i++, day = shiftISO(day, 1))
    if (ruleFallsOn(r, day, anchor)) out.push(day);
  return out;
}
