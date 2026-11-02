/* Build the storage this space asked for, degrading loudly rather than
   silently writing somewhere the user did not expect. */
async function spaceBackend(sp) {
  if (sp.kind !== "fs") LOST_FOLDER.delete(sp.name);   // no folder asked for, none missing
  if (sp.kind === "http" && sp.server) {
    try { const b = Backends.http(sp.server); await b.ping(); return b; }
    catch (e) { notify(`"${sp.name}" server unreachable, using browser storage.`, "warn"); }
  }
  if (sp.kind === "fs") {
    try {
      const h = await IDB.get("kv", "dir:" + sp.name);
      if (h) {
        if ((await h.queryPermission({mode: "readwrite"})) === "granted") {
          PENDING_GRANT.delete(sp.name);
          return Backends.fs(h);
        }
        /* The handle is still here: the folder IS remembered. Only the
           permission lapsed, which is what every browser does to a page
           opened fresh from a download. Granting it again needs a click, so
           park the handle and let offerFolderReconnect() ask for that one
           click -- there is nothing for anyone to go looking for. */
        PENDING_GRANT.set(sp.name, h);
        LOST_FOLDER.delete(sp.name);
      }
    } catch (_) {}
    /* No handle at all, or one the browser will not even ask about: the
       folder is not remembered, and browser storage is not it. Without a
       word the area just looks empty, as if its files were gone (#164). */
    if (!PENDING_GRANT.has(sp.name)) LOST_FOLDER.add(sp.name);
  }
  const ns = sp.legacyFlat ? "" : sp.name;
  return CAP.idb ? Backends.idb(ns) : CAP.ls ? Backends.ls(ns) : Backends.memory(ns);
}
