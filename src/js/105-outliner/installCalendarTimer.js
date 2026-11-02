function installCalendarTimer() {
  document.addEventListener("keydown", () => { CAL_LAST_KEY = Date.now(); }, true);
  setInterval(() => {
    updateCalChips();
    if (!document.hidden && Date.now() - CAL_LAST_KEY > 6e4) maybeSyncCalendars();
  }, 6e4);
}
