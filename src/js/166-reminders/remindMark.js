function remindMark(key, snoozeMs = 0) {
  const seen = remindSeen();
  const old = shiftISO(todayISO(), -3);
  for (const k of Object.keys(seen)) if ((seen[k].day || "") < old) delete seen[k];
  seen[key] = {day: todayISO(), snooze: snoozeMs ? Date.now() + snoozeMs : 0};
  PREF.set(REMIND_PREF, JSON.stringify(seen));
}
