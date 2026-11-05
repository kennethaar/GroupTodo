/* The button at the top: the meeting on now, else the next one today. When
   meetings overlap, the one on now is the latest to start -- a short meeting
   inside a long one -- and the next one's start is counted down beside it. */
function paintNextMeeting(list = todaysMeetings()) {
  const btn = $("#nextMeet");
  if (!btn) return;
  const now = Date.now();
  const on = list.filter(m => m.start <= now && now < m.end)
    .sort((a, b) => b.start - a.start || a.end - b.end)[0];
  const next = list.find(m => m.start > now);
  const m = on || next;
  btn.textContent = "";
  if (!m) { btn.hidden = true; btn.onclick = null; return; }
  btn.hidden = false;
  const lead = meetRemindLead();
  const soon = next && lead != null && next.start - now <= lead * 6e4;
  btn.classList.toggle("now", !!on);
  btn.classList.toggle("soon", !on && soon);
  // Counted down only in the last hour; further off, the time says it plainly.
  const when = on ? "now, until " + hhmm(m.end) : m.start - now > 36e5 ? "at " + hhmm(m.start) : untilWords(m.start - now);
  btn.title = m.title + ", " + hhmm(m.start) + "–" + hhmm(m.end) + (on ? " (on now)" : " (" + when + ")") +
    (on && next ? ". Next: " + next.title + ", " + hhmm(next.start) + " (" + untilWords(next.start - now) + ")" : "") +
    ". Click to open it." + (lead == null ? " Reminders are off (Calendars)." : lead ? " Reminded " + lead + " min before." : " Reminded at the start.");
  btn.append(el("span", {class: "ic", "aria-hidden": "true"}, "\u{1F552}"),
    el("span", {class: "t"}, m.title), el("span", {class: "w"}, when));
  if (on && next) btn.append(el("span", {class: "n" + (soon ? " soon" : "")}, "· next " + untilWords(next.start - now)));
  btn.onclick = () => openBlockAt(m.space, m.path, m.block);
}
