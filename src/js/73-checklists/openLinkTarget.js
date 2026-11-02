function openLinkTarget(target) {
  target = trim(target).split("][")[0];
  /* A go/ link goes somewhere in the app, so it never creates a page. */
  const door = /^go\/(.+)$/.exec(target);
  if (door) { goTour(trim(door[1])); return; }
  if (/^\d{4}-\d{2}-\d{2}$/.test(target)) { openPage(ensureJournal(target)); return; }
  // [[2026-W44]] is the Journal's week.
  if (weekMonday(target)) { go("today", {sub: "week", todayWeek: target, todayDay: null, todayWho: null, jz: null}); return; }
  const existing = findExistingPage(target);
  if (existing) { openPage(existing); return; }
  const path = resolveWikiPath(target);
  const m = /^([^/]+)\/(.+)$/.exec(target);
  const kind = m && (STATUS_DIRS[m[1]] || PREFIX_DIR[m[1]]) ? m[1] : "page";
  const title = m && (STATUS_DIRS[m[1]] || PREFIX_DIR[m[1]]) ? m[2] : target;
  /* A folder can hold a page the app has not read in (#188). A blank page
     made here would be written over it, so the folder is asked first. */
  if (V.backend?.kind === "fs" && V.backend.readText) {
    const space = V.space;
    V.backend.readText(path).then(text => inSpace(space, () => {
      if (!V.pages.has(path) && text == null && V.backend.unread?.has(path)) {
        notify(path + " is in the folder but would not open. Check the folder in Vault & sync reads it again.", "warn");
        return;
      }
      if (!V.pages.has(path)) {
        if (text != null && trim(text)) {
          putPage(path, parsePage(text), {silent: true});
          noteBase(LOADED.get(space), path, text);
          notify("Read " + path + " from the folder. It was there, but had not been read in.", "warn");
        } else {
          putPage(path, pageTemplateFor(kind, title));
          notify("Created page: " + path);
        }
        scanVerbs();
      }
      if (V.space === space) openPage(path);
    }));
    return;
  }
  putPage(path, pageTemplateFor(kind, title));
  notify("Created page: " + path);
  scanVerbs();
  openPage(path);
}
