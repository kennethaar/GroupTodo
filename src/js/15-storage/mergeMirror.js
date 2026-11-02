async function mergeMirror(rec) {
  const mode = mirrorMode(rec);
  if (mode === "off") return 0;
  let newer = 0;
  try {
    const m = mirrorFor(rec);
    const open = mode === "full" ? await unconfirmed(rec) : null;
    let pruned = false;
    for (const [path, text] of await m.list()) {
      const local = parsePage(text);
      const fromBackend = rec.pages.get(path);
      if (!fromBackend && mode === "full" && !open.has(path)) {
        // The backend answered and does not have this page, and we never failed
        // to send it: somebody else deleted it. Let the deletion stand.
        try { await m.remove(path); pruned = true; } catch (_) {}
        continue;
      }
      const a = local.props?.updated || "";
      const b = fromBackend?.props?.updated || "";
      if (!fromBackend || a > b) {
        /* Both have the page: merged, line by line, so neither is dropped.
           Taken whole, a day page made from its templates in browser storage
           went over the day written in the folder (#232). */
        const theirs = fromBackend && serializePage(fromBackend);
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
