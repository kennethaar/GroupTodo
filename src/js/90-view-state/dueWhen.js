/* The day a task is due, and the time when it has one, from the same property
   dueDate() reads -- so the chip and the reminder never disagree with it. */
function dueWhen(b) {
  for (const key of ["SCHEDULED", "DEADLINE", "due"]) {
    const raw = blockProp(b, key);
    const day = dateIn(raw);
    if (day) return {key, day, time: timeIn(String(raw).replace(/\[\[[^\]]*\]\]/g, " "))};
  }
  return null;
}
