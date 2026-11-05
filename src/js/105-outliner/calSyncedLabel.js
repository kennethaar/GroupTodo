function calSyncedLabel(f) {
  const at = calStamps(CAL_SYNCED_KEY)[calFeedId(f.url)];
  return at ? "Synced " + calClock(at) : "Not synced yet";
}
