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
    let again = 0, unread = false;
    for (const rec of [...LOADED.values()]) {
      try {
        const how = await syncWidgets(rec, {read: r});
        if (how === "wait") { again = again ? Math.min(again, 2000) : 2000; unread = true; }   // the active projects are near
        if (how === "later") again = again || 4000;                         // the rest of the folder is not
      } catch (e) { appLog("widgets of " + rec.name + ": " + ((e && e.message) || e)); }
    }
    /* Ticks are read once, when the area can take them; one still waiting for
       its page is read again by itself (widgetTicksWait). */
    if (again) scheduleWidgets(r && unread, again);
  }, wait);
}
