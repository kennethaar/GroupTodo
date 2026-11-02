function quietNudge(id, days) {
  PREF.set("nudge.quiet." + id, shiftISO(todayISO(), days == null ? CFG.nudgeSnoozeDays : days));
}
