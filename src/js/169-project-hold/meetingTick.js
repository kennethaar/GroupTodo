function meetingTick() {
  if (!V.loaded) return;
  const list = todaysMeetings();
  paintNextMeeting(list);
  const lead = meetRemindLead();
  if (lead == null) return;
  const now = Date.now(), done = meetReminded();
  let changed = false;
  for (const m of list) {
    if (done.has(m.key)) continue;
    // Not for one long started: opening the app at three is no time to hear about the one at nine.
    if (now >= m.start - lead * 6e4 && now < m.start + 2 * 6e4) { remindMeeting(m); done.add(m.key); changed = true; }
  }
  if (changed) safeLS.set("gtd.meetReminded", JSON.stringify({day: todayISO(), keys: [...done]}));
}
