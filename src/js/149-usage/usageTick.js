function usageTick() {
  if (USAGE_DAY !== todayISO()) { USAGE_DAY = todayISO(); usageWrite(); }
  if (!usageOn() || document.hidden || Date.now() - USAGE.lastInput > USAGE_IDLE_MS) return;
  usageBump(USAGE.place, 1, USAGE_TICK_S);
  usageSave();
}
