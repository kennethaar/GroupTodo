/* "Try now": the widening wait is for when nobody is looking. Somebody who
   just plugged the drive back in should not sit out the rest of a minute. */
function saveNow() {
  retryWait = 0;
  clearTimeout(flushTimer);
  return flush();
}
