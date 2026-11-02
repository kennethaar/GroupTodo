function installSensing() {
  senseQuietly(); senseCachePos();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { senseQuietly(); senseCachePos(); } });
}
