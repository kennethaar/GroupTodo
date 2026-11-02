function installUsageLog() {
  document.addEventListener("pointerdown", usageInput, true);
  document.addEventListener("keydown", usageInput, true);
  document.addEventListener("visibilitychange", () => { if (document.hidden) usageSave(); });
  setInterval(usageTick, USAGE_TICK_S * 1000);
  setTimeout(usageTick, 5000);
}
