async function grantSpaceFolder(name) {
  const h = PENDING_GRANT.get(name);
  if (!h) return false;
  let ok = false;
  try { ok = (await h.requestPermission({mode: "readwrite"})) === "granted"; }
  catch (_) {
    // Not declined: the browser could not ask, so the folder has to be picked again.
    PENDING_GRANT.delete(name);
    LOST_FOLDER.add(name);
    offerFolderPick(name);
    return false;
  }
  if (!ok) {
    notify("Permission to " + (h.name || "the folder") + " was declined. " +
           (Spaces.get(name) ? Spaces.get(name).name : name) + " stays in browser storage.", "warn");
    return false;
  }
  PENDING_GRANT.delete(name);
  if (Spaces.active === name) await openSpace(name);   // re-read, now from the folder
  else LOADED.delete(name);                            // next open picks the folder up
  notify((Spaces.get(name) ? Spaces.get(name).name : name) + " is back on " + h.name + ".");
  return true;
}
