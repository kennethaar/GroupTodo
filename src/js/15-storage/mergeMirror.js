async function mergeMirror(rec) {
  const mode = mirrorMode(rec);
  if (mode === "off") return 0;
  let newer = 0;
  try {
    const m = mirrorFor(rec);
    const open = mode === "full" ? await unconfirmed(rec) : null;
    let pruned = false;
    for (const [path, text] of await m.list()) {
      const fromBackend = rec.pages.get(path);
      /* The folder is still being read: a page not in yet is not missing, and
         taken for one the whole browser copy went to the folder again --
         1642 files on a phone (#340). It is merged once the read is done. */
      if (rec.stubs && (!fromBackend || stillLoading(rec, path))) continue;
      const local = parsePage(text);
      if (!fromBackend && mode === "full" && !open.has(path)) {
        // The backend answered and does not have this page, and we never failed
        // to send it: somebody else deleted it. Let the deletion stand.
        try { await m.remove(path); pruned = true; } catch (_) {}
        continue;
      }
      const a = local.props?.updated || "";
      const b = fromBackend?.props?.updated || "";
      const theirs = fromBackend && serializePage(fromBackend);
      /* A folder's browser copy holds only what the folder has not taken.
         The folder has this one, or a later one: the copy has done its job. */
      if (mode === "pending" && fromBackend && (theirs === text || a <= b)) {
        try { await m.remove(path); } catch (_) {}
        continue;
      }
      if (!fromBackend || a > b) {
        /* Both have the page: merged, line by line, so neither is dropped.
           Taken whole, a day page made from its templates in browser storage
           went over the day written in the folder (#232). */
        if (theirs === text) continue;
        rec.pages.set(path, fromBackend ? mergePageText(path, undefined, theirs, text).page : local);
        rec.dirty.add(path);          // the backend has not seen this yet
        newer++;
      }
    }
    if (pruned && mode === "full") await setUnconfirmed(rec, open);
  } catch (_) {}
  return newer;
}
