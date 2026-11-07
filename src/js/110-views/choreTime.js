/* Chores or the work: on a phone Next shows one or the other. Before and
   after work hours, and on a day off, it is the chores; in work hours, the
   to-dos. Work hours are your work_hours::, else weekdays 8 to 16. A tap
   picks the other side until the next change of shift. */
function choreTime(now = new Date()) {
  const wh = workHours();
  return !inWorkHours({ctx: "work", from: wh.start, to: wh.end, days: wh.days}, now);
}
