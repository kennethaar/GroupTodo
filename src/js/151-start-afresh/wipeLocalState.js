async function wipeLocalState() {
  const notes = [];

  /* The database goes first because it is the only step that can refuse. A
     half-wipe -- settings gone, pages still here -- is worse than no wipe, so
     nothing else is touched until this one has actually happened. */
  try { IDB.close(); } catch (_) {}
  if (!(await deleteDatabase("grouptodo"))) {
    notes.push("the pages are still held open by another tab - close GroupToDo\u2019s " +
               "other tabs and try again. Nothing has been deleted");
    return notes;
  }

  /* Every key we own is prefixed, so the scan is exact and anything else on
     the same origin is left alone. Collect first, then delete: removing
     while iterating renumbers localStorage underneath you. */
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("gtd.")) keys.push(k);
    }
    keys.forEach(k => safeLS.del(k));
  } catch (_) {}

  // The offline shell, and the one-item mailbox shared files land in.
  if ("caches" in window) {
    try {
      const names = await caches.keys();
      await Promise.all(names.filter(n => /^grouptodo/.test(n)).map(n => caches.delete(n)));
    } catch (_) {}
  }

  /* Unregistered last: while it lives it can answer the reload out of a
     cache we have just deleted anyway, and unregistering first would leave
     the caches orphaned if a later step threw. */
  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    } catch (_) {}
  }
  return notes;
}
