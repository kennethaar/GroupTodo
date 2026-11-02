/* ============================================================
   151_START AFRESH -- empty this browser and reload
   ============================================================ */
/* Everything this app keeps in a browser lives in exactly three places: the
   gtd.* keys in localStorage, the "grouptodo" IndexedDB database, and the
   caches the service worker fills. Wiping all three and reloading used to be
   a DevTools console errand, done from memory and usually half done -- the
   service worker left registered, so the next load came back out of the old
   cache and looked like the wipe had failed. This does the whole sequence in
   the right order, from a button, behind a typed phrase.

   It is deliberately local: a vault FOLDER on disk is the real vault and is
   never touched, nor is a linked vault file, nor a sync server. */

/* indexedDB.deleteDatabase blocks silently while any connection is open --
   including one in another tab of the same app. Resolves true when the
   database is gone, false when something else is still holding it. */
function deleteDatabase(name) {
  return new Promise(res => {
    let done = false;
    const settle = v => { if (!done) { done = true; res(v); } };
    let r;
    try { r = indexedDB.deleteDatabase(name); } catch (_) { return settle(false); }
    r.onsuccess = () => settle(true);
    r.onerror   = () => settle(false);
    r.onblocked = () => settle(false);
    setTimeout(() => settle(false), 4000);   // no event at all: do not hang
  });
}
