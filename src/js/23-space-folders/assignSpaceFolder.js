/* Pick a folder for one space, refusing anything that collides.
   join: picked on the welcome screen, where nothing has been written yet --
   so a folder that already holds a vault is somebody's area being joined,
   not a home for the starter pages.
   invited: they said so, and that settles it even for a folder still empty.
   Resolves to {existing, joined} when the folder was taken, else false. */
async function assignSpaceFolder(name, {join = false, invited = false, returning = false} = {}) {
  if (!CAP.dirPicker) {
    notify("This browser cannot open folders.", "warn");
    return false;
  }
  const sp = Spaces.get(name);
  if (!sp) return false;
  let handle;
  const prev = PENDING_GRANT.get(name) || await storedHandle(name);
  try {
    const opts = {mode: "readwrite", id: "gtd-space-" + name};
    // startIn makes the picker open on the folder this space last used, so
    // even a real re-pick starts where it ended rather than at Documents.
    if (prev) opts.startIn = prev;
    // The browser's own dialog only says "where this site can save changes",
    // and a page cannot reword it -- so this says what it is about.
    notify(join ? "Pick the folder your list lives in - a shared one, or a new one of your own."
                : "Pick the folder for " + name + ". The browser asks where this site can save changes: that is this.");
    handle = await window.showDirectoryPicker(opts);
  } catch (e) {
    if (e.name !== "AbortError") notify("Could not open that folder: " + e.message, "error");
    return false;
  }
  const clash = await folderConflict(handle, name);
  if (clash) { notify(conflictMessage(name, clash), "error"); return false; }

  const wasFolder = sp.kind === "fs" ? (sp.label || "the old folder") : null;
  /* The same folder again is a reconnect, not a move: there is nothing to
     bring along, and asking named the one folder twice (#164). Without a
     handle to compare, a lost folder is known by its name. */
  let same = false;
  if (wasFolder) {
    if (prev) { try { same = await prev.isSameEntry(handle); } catch (_) {} }
    if (!same && LOST_FOLDER.has(name)) same = handle.name === sp.label;
  }
  const rec = newRecord(name, Backends.fs(handle));
  PREF.set("pagecount:" + name, "0");               // a folder chosen on purpose is never "the old one, emptied"
  await readInto(rec);                              // what the folder already has wins
  const existing = rec.pages.size > 0;

  /* Whatever the space holds in this browser has to come with it, or moving
     a space into a folder would look exactly like losing everything in it.
     Two exceptions: the welcome screen's starter pages never go into a vault
     somebody already keeps, and folder to folder is asked. */
  let carried = new Map();
  // On the welcome screen nothing is yours yet, and a second pick there is a
  // change of mind, not a move: the first folder's pages stay in it.
  let carry = join ? !existing && !wasFolder && !invited : true;
  if (carry && wasFolder) {
    const loaded = LOADED.get(name);
    carry = same ? false : await askCarryPages(name, wasFolder, handle.name, loaded ? loaded.pages.size : 0);
  }
  if (carry) {
    try {
      const prev = LOADED.get(name) || await loadSpaceRecord(name);
      if (prev) carried = new Map(prev.pages);
    } catch (_) {}
  }

  /* Somebody's vault, taken as it is: shared, whether or not they named
     themselves. Unless it already knows you -- your own vault opened on a
     second computer is not one you joined. */
  const me = journalOwner(), myPage = whoAmI() ? rec.pages.get(personPath(whoAmI())) : null;
  const knowsMe = (myPage && trim(String(myPage.props?.member || "")) === "true") ||
    (!!me && Array.from(rec.pages.keys()).some(p => isJournalPath(p) && journalOwnerOf(p) === me));
  // Coming back to your own folders at a new address is never joining.
  const joined = join && !returning && (invited || (existing && !knowsMe));

  /* On the welcome screen the area has no name anybody chose yet, so it takes
     the one the folder carries -- the name its people gave it -- and, for a
     folder joined without one, the folder's own name rather than "Personal". */
  const stored = trim(String(rec.pages.get(SETTINGS_PATH)?.props?.area_name || ""));
  if (join && (sp.placeholder || sp.nameFrom) && (stored || joined || returning)) {
    const want = stored || handle.name;
    const renamed = want === name ? sp : await Spaces.rename(name, want);
    if (renamed) { name = renamed.name; rec.name = name; sp.nameFrom = stored ? "stored" : "folder"; }
  }

  await IDB.set("kv", "dir:" + name, handle);
  PENDING_GRANT.delete(name);
  LOST_FOLDER.delete(name);
  sp.kind = "fs"; sp.label = handle.name;
  /* placeholder is kept: a folder is a home, not a history. The spaces wizard
     reads that flag to tell auto-seeded scaffolding from a space somebody
     actually asked for, and a folder chosen on the welcome screen is carried
     over rather than making the two answers contradict each other. */
  delete sp.legacyFlat;
  sp.askedStorage = true;
  // A second pick on the welcome screen is a change of mind, so this is set afresh.
  if (join) { if (joined) sp.joined = todayISO(); else delete sp.joined; }
  await Spaces.save();

  let moved = 0;
  for (const [path, page] of carried) {
    if (rec.pages.has(path)) continue;
    rec.pages.set(path, page);
    rec.dirty.add(path);
    moved++;
  }
  LOADED.set(name, rec);

  if (name === Spaces.active) {
    bindActive(name);
    migrateVault();
    await seedIfEmpty();
    scanVerbs();
  }
  storeAreaName(name);
  await flush();
  if (joined && existing)
    notify("Opened \u201C" + handle.name + "\u201D as it is: " + rec.pages.size + " pages, nothing of yours added.");
  else if (same)
    notify(name + " is back on \u201C" + handle.name + "\u201D.");
  else
    notify(name + " now lives in \u201C" + handle.name + "\u201D" +
           (moved ? ", with " + moved + " page" + (moved === 1 ? "" : "s") + " moved in." : "."));
  render();
  return {existing, joined};
}
