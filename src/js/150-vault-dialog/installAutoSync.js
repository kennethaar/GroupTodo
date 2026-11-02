function installAutoSync() {
  const onReturn = () => { catchUpWithSiblings().catch(() => {}); autoSyncLinked(); refreshFromServer(); maybeSyncCalendars(CAL_RETURN_MIN); };
  window.addEventListener("focus", onReturn);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) onReturn();
  });
}
