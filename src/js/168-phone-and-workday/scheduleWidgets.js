/* After a save, once an area is all in, and when the app comes back on
   screen: every area's widget files, a moment later and once (#474). */
function scheduleWidgets(read = false) {
  WIDGET_READ = WIDGET_READ || read;
  clearTimeout(WIDGET_TIMER);
  WIDGET_TIMER = setTimeout(async () => {
    const r = WIDGET_READ;
    WIDGET_READ = false;
    for (const rec of [...LOADED.values()]) {
      try { await syncWidgets(rec, {read: r}); }
      catch (e) { appLog("widgets of " + rec.name + ": " + ((e && e.message) || e)); }
    }
  }, 1500);
}
