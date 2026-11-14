/* A slow start, traced (#181). Each step of opening an area goes into the
   log with the seconds since the page began and, given when it started, how
   long it took: Save log (Check the folder) then shows which step holds the
   day back. The same lines go to the browser console as they happen. */
function loadMark(text, since = null) {
  const now = performance.now();
  const span = ms => ms < 1000 ? Math.round(ms) + " ms" : (ms / 1000).toFixed(1) + " s";
  const line = "load +" + (now / 1000).toFixed(1) + " s  " + text + (since != null ? " in " + span(now - since) : "");
  appLog(line);
  try { console.info("[GroupToDo] " + line); } catch (_) {}
  return now;
}
