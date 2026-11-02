function morningRoutine() {
  PREF.set(MORNING_BEGUN, todayISO());
  openWeeding();
}
