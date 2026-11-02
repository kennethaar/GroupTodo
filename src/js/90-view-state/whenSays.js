function whenSays(w) {
  const bits = [];
  if (w.SCHEDULED) bits.push(humanWhen(w.SCHEDULED, w.DEADLINE ? null : w.time));
  if (w.DEADLINE) bits.push("due " + humanWhen(w.DEADLINE, w.SCHEDULED ? null : w.time));
  if (w.repeat) bits.push("repeats " + w.repeat);
  if (w.until) bits.push("expires after " + humanDate(w.until));
  if (w.priority) bits.push("priority " + w.priority);
  if (w.hold) bits.push(holdWords(w.hold));
  if (w.remind) {
    const lead = remindLead(w.remind);
    bits.push(lead == null ? "no reminder" : lead === 0 ? "reminder at the time" : "reminder " + w.remind + " before");
  }
  return bits.join(", ");
}
