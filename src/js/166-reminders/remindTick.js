function remindTick() {
  if (!V.loaded || !INIT_DONE) return;
  const today = todayISO();
  if (REMIND_DAY && REMIND_DAY !== today) { clearMemo(); expireOverdue(); render(); }
  REMIND_DAY = today;
  for (const n of document.querySelectorAll(".cd-left")) n.textContent = whenUntilWords(n.dataset.day, n.dataset.time || null);
  syncSendButton();
  workdayNudge();
  sendNudge();
  const seen = remindSeen();
  for (const e of upcomingEvents()) {
    const key = eventKey(e);
    const was = seen[key];
    if (was && !(was.snooze && Date.now() >= was.snooze)) continue;
    if (e.kind === "birthday") {
      if (e.day !== today) continue;
    } else {
      if (!e.time) continue;
      const lead = remindLead(blockProp(e.a.block, "remind"));
      if (lead == null) continue;
      const left = minutesUntil(e.day, e.time);
      if (left > lead || left < -120) continue;
    }
    remindMark(key);
    reminderToast(e);
  }
}
