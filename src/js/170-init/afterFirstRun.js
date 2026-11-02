function afterFirstRun() {
  /* Reached from the space-folder dialog as well as from startup, and that
     dialog is also how the coach strip asks its "where" question weeks later --
     so the hints below are once a day, not once per dialog. */
  if (PREF.get("hinted") === todayISO()) return;
  PREF.set("hinted", todayISO());
  if (!coachOn()) notify("N add a task \u00B7 / search \u00B7 ? help");
}
