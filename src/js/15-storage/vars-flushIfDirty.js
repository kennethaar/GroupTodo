window.addEventListener("beforeunload", e => {
  if (WIPING) return;
  // Every area, not only the one on screen: the review changes projects in all of them.
  if ([...LOADED.values()].some(r => r.dirty.size || r.removed.size) || V.dirty.size) {
    flush(); e.preventDefault(); e.returnValue = "";
  }
});

/* Leaving the tab -- switching away, a phone putting the browser to sleep, the
   window closing -- is the last moment anything is sure to run, so whatever is
   waiting out the debounce goes now rather than in 450 ms that may never come. */
const flushIfDirty = () => {
  if (WIPING) return;
  if ([...LOADED.values()].some(r => r.dirty.size || r.removed.size)) flush();
};
document.addEventListener("visibilitychange", () => { if (document.hidden) flushIfDirty(); });
window.addEventListener("pagehide", flushIfDirty);

/* ---------- the same vault open twice (#233) ----------
   The installed app and a tab on the same site share one browser storage,
   and so do two tabs; two windows on one folder share its files. Each held
   the copy it read at the start, so the one left open showed old pages and,
   the next time it saved one, put its old copy over the other's work. Saves
   are merged with what is stored now (writePageChecked), and each window
   tells the others which pages it saved, so they read them again. A window
   that was asleep and missed that looks at the stamp each save leaves when
   it is shown again. */
const WINDOW_ID = Math.random().toString(36).slice(2) + Date.now().toString(36);
const SIBLINGS = (() => {
  try { return typeof BroadcastChannel === "function" ? new BroadcastChannel("grouptodo.saved") : null; }
  catch (_) { return null; }
})();
const siblingStampKey = name => "gtd.saved:" + name;
const SIBLING_SEEN = new Map();          // area -> the last stamp this window has caught up with
