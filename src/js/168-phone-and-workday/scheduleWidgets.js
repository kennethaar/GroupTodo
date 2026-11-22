/* After a save, once an area is all in, and when the app comes back on
   screen: every area's widget files, a moment later and once. An area still
   coming in is tried again a few seconds on, until it is in: asked for at
   start-up, the files waited for a save that might not come (#474). */
function scheduleWidgets(read = false, wait = 1500) {
  WIDGET_READ = WIDGET_READ || read;
  clearTimeout(WIDGET_TIMER);
  WIDGET_TIMER = setTimeout(async () => {
    const r = WIDGET_READ;
    WIDGET_READ = false;
    let later = false;
    for (const rec of [...LOADED.values()]) {
      try { if ((await syncWidgets(rec, {read: r})) === "later") later = true; }
      catch (e) { appLog("widgets of " + rec.name + ": " + ((e && e.message) || e)); }
    }
    if (later) scheduleWidgets(r, 3000);
  }, wait);
}
