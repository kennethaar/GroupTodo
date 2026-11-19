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

  const here = serverFolderOptions();
  const sameBase = a => String(a || "").replace(/\/$/, "") === String(base).replace(/\/$/, "");
  const toLabel = (here.find(o => sameBase(o.base)) || {}).name || "the server folder";
  const wasFolder = sp.kind === "fs" ? (sp.label || "the old folder")
                  : sp.kind === "http" ? (here.find(o => o.users.includes(sp)) || {}).name || "the old server folder"
                  : null;
  let prev = LOADED.get(name);
  if (!prev) { try { prev = await loadSpaceRecord(name); } catch (_) { prev = null; } }
  const mine = prev ? prev.pages.size : 0;
  /* Both places hold pages, so copying is a choice and not the default, as it
     is folder to folder: a browser area moved in unasked wrote its starter
     pages into a vault that was already there, which read as the folder being
     imported twice (#432). */
  const carry = join ? rec.pages.size === 0 && !wasFolder
    : mine && (wasFolder || rec.pages.size)
      ? await askCarryPages(name, wasFolder || "this browser", toLabel, mine)
    : true;
  const carried = carry && prev ? new Map(prev.pages) : new Map();

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
  notify(name + " now lives in " +
         (toLabel === "the server folder" ? toLabel : "the server folder “" + toLabel + "”") +
         (moved ? ", with " + moved + " page" + (moved === 1 ? "" : "s") + " moved in." : "."));
  render();
  return true;
}
