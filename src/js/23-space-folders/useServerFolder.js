/* Move one area into serve.py's folder (#356), as assignSpaceFolder moves one
   into a folder the browser opens: what the folder holds wins, the area's
   pages from this browser come along, and folder to folder is asked.
   join: picked on the welcome screen, where nothing is yours yet, so a
   folder that already holds a vault gets none of the starter pages.
   Resolves true when the area moved. */
async function useServerFolder(name, base = SERVER_BASE, {join = false} = {}) {
  const sp = Spaces.get(name);
  if (!sp || !base) return false;
  const taken = serverFolderUsers(base).find(x => x.name !== name);
  if (taken) {
    notify("That server folder already holds " + taken.name + ". Give " + name + " a folder of its own.", "error");
    return false;
  }
  const rec = newRecord(name, Backends.http(base));
  try { await readInto(rec); }
  catch (e) { notify("Server not reachable: " + e.message, "error"); return false; }
  /* An area nobody named yet, as on the welcome screen, takes the name the
     folder carries, as assignSpaceFolder does. */
  const stored = trim(String(rec.pages.get(SETTINGS_PATH)?.props?.area_name || ""));
  if (sp.placeholder && stored && stored !== name) {
    const renamed = await Spaces.rename(name, stored);
    if (renamed) { name = renamed.name; rec.name = name; sp.nameFrom = "stored"; }
  }

  const wasFolder = sp.kind === "fs" ? (sp.label || "the old folder") : null;
  const loaded = LOADED.get(name);
  const carry = join ? rec.pages.size === 0 && !wasFolder
    : wasFolder ? await askCarryPages(name, wasFolder, "the server folder", loaded ? loaded.pages.size : 0)
    : true;
  let carried = new Map();
  if (carry) {
    try {
      const prev = loaded || await loadSpaceRecord(name);
      if (prev) carried = new Map(prev.pages);
    } catch (_) {}
  }

  sp.kind = "http"; sp.server = base;
  delete sp.label; delete sp.legacyFlat;
  sp.askedStorage = true;
  PENDING_GRANT.delete(name);
  LOST_FOLDER.delete(name);
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
  notify(name + " now lives in the server folder" +
         (moved ? ", with " + moved + " page" + (moved === 1 ? "" : "s") + " moved in." : "."));
  render();
  return true;
}
