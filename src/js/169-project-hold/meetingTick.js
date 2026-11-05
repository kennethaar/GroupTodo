function meetingTick() {
  if (!V.loaded) return;
  paintNextMeeting(todaysMeetings());
  // Days ahead the earliest reminder reaches, over all meetings and calendars.
  const reach = Math.max(-1, ...[null, ...calFeeds().map(f => calFeedId(f.url))].map(f => meetRemindLead(f) ?? -1));
  if (reach < 0) return;
  const now = Date.now(), done = meetReminded(), d = new Date();
  let changed = false;
  for (let i = 0; i <= Math.ceil(reach / 1440); i++) {
    for (const m of todaysMeetings(isoOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i)))) {
      if (done.has(m.key)) continue;
      // Not for one long started: opening the app at three is no time to hear about the one at nine.
      if (now >= m.start + 2 * 6e4) continue;
      // Reminders missed while away come as one.
      const due = meetRemindLeads(blockProp(m.block, "cal_feed"))
        .filter(l => now >= m.start - l * 6e4 && !done.has(m.key + "\u0000" + l));
      if (!due.length) continue;
      remindMeeting(m);
      for (const l of due) done.add(m.key + "\u0000" + l);
      changed = true;
    }
  }
  if (changed) safeLS.set("gtd.meetReminded", JSON.stringify({day: todayISO(), keys: [...done]}));
}
