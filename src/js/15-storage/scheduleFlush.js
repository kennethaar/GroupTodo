function scheduleFlush() {
  clearTimeout(flushTimer);
  setSync("warn", "unsaved");
  retryWait = 0;
  flushTimer = setTimeout(flush, 450);
}
