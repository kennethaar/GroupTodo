function retryFlush() {
  retryWait = retryWait ? Math.min(retryWait * 2, 60000) : 3000;
  clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, retryWait);
}
