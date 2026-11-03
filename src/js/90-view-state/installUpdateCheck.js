function installUpdateCheck() {
  const tick = () => {
    if (updatesOn() && navigator.onLine !== false && PREF.get("update.checked") !== todayISO()) checkForUpdate();
  };
  setTimeout(tick, 5000);          // once the start has settled
  setInterval(tick, 3600 * 1000);  // and again when the app is left open past midnight
}
