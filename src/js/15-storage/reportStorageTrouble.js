function reportStorageTrouble(rec, e) {
  const key = (e && e.name) || "error";
  if (rec.offline === key) return;        // the same trouble, already said once
  rec.offline = key;
  const label = spaceLabel(rec.name);
  if (permissionLapsed(e) && rec.backend && rec.backend.kind === "fs" && rec.backend.handle) {
    PENDING_GRANT.set(rec.name, rec.backend.handle);
    notify(label + " needs permission to its folder again. Nothing is lost - the work is " +
           "on this device and goes up the moment you allow it.", "warn",
           {label: "Reconnect", run: () => offerFolderReconnect(rec.name)});
    return;
  }
  // The storage answers but one file will not go: usually a sync client holding it.
  const stuck = /^could not remove (.+?) \(/.exec((e && e.message) || "");
  if (stuck) {
    notify("The old copy of " + stuck[1] + " in " + label + " could not be deleted yet - " +
           "something has it open (OneDrive often does). Trying again; until it goes, it may show up " +
           "on its old shelf on another device.", "warn");
    return;
  }
  notify("Cannot reach " + label + "'s storage - " + storageReason(e) + ". Saved on this " +
         "device and it will go up when the connection is back.", "warn",
         {label: "Try now", run: saveNow});
}
