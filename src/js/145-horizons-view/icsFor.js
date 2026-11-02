function icsFor(items) {
  const now = nowStamp().replace(/[-:]/g, "");
  const out = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GroupToDo//EN", "CALSCALE:GREGORIAN"];
  items.forEach((a, i) => {
    const day = a.due;
    if (!day) return;
    out.push("BEGIN:VEVENT");
    out.push(icsFold("UID:" + (a.block.id || ("gtd-" + i)) + "@grouptodo"));
    out.push("DTSTAMP:" + now);
    const w = calWhen(a);
    if (w.time) {
      // Floating local time: the clock the task says, wherever the calendar is.
      out.push("DTSTART:" + icsStamp(w.day, w.time));
      out.push("DTEND:" + icsStamp(w.endDay, w.endTime));
    } else {
      // All-day: DTEND is exclusive, so a one-day task ends the next morning.
      out.push("DTSTART;VALUE=DATE:" + icsDate(day));
      out.push("DTEND;VALUE=DATE:" + icsDate(w.endDay));
    }
    out.push(icsFold("SUMMARY:" + icsEsc(titleForRow(a.title))));
    const notes = [a.project ? "Project: " + a.project : null,
                   a.context ? "Context: @" + a.context : null,
                   a.assignee ? "For: " + a.assignee : null].filter(Boolean).join("\n");
    if (notes) out.push(icsFold("DESCRIPTION:" + icsEsc(notes)));
    out.push("TRANSP:TRANSPARENT");          // a to-do should not show you as busy
    out.push("END:VEVENT");
  });
  out.push("END:VCALENDAR");
  return out.join("\r\n") + "\r\n";
}
