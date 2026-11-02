/* When a task goes in: at its time, for as long as its dots say (an hour
   when it has none), or the whole day when it has no time. */
function calWhen(a) {
  const w = a.block ? dueWhen(a.block) : null;
  const time = a.time !== undefined ? a.time : (w && w.day === a.due ? w.time : null);
  if (!time) return {day: a.due, endDay: shiftISO(a.due, 1), time: null, endTime: null};
  const [h, m] = time.split(":").map(Number);
  const end = h * 60 + m + (estMinutes(a.title) || 60);
  return {day: a.due, time, endDay: shiftISO(a.due, Math.floor(end / 1440)),
          endTime: pad2(Math.floor(end % 1440 / 60)) + ":" + pad2(end % 60)};
}
