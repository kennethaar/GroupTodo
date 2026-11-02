/* Called from touch(): write back a little after the typing stops. */
function scheduleAutoSync() {
  if (!autoSyncOn() || !CAP.savePicker) return;
  clearTimeout(AUTOSYNC_TIMER);
  AUTOSYNC_TIMER = setTimeout(() => autoSyncLinked(), 45000);
}
