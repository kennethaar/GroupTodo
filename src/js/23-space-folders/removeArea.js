/* Removing an area forgets it on this device. A folder or a server keeps its
   files, so picking it again brings the area back; an area kept only in this
   browser has nowhere else, so its pages go with it, and the dialog says so. */
async function removeArea(name) {
  const sp = Spaces.get(name);
  if (!sp || Spaces.list.length < 2) return false;
  await flush();
  const rest = Spaces.list.filter(s => s.name !== name).map(s => s.name);
  const shown = visibleSpaces().filter(n => n !== name);
  setVisibleSpaces(shown.length ? shown : [rest[0]]);
  if (Spaces.active === name) await openSpace(shown[0] || rest[0]);
  LOADED.delete(name); PENDING_GRANT.delete(name); LOST_FOLDER.delete(name);
  if (sp.kind === "local") {
    if (sp.legacyFlat) await clearFlatStorage();
    else {
      for (const store of ["files", "assets"]) {
        try { for (const k of await IDB.keys(store)) if (String(k).startsWith(name + "|")) await IDB.del(store, k); } catch (_) {}
      }
      try { for (const k of LS.all().keys()) if (k.startsWith(name + "|")) LS.del(k); } catch (_) {}
    }
  }
  for (const key of ["identity", "pagecount", "pagecount-pages"]) PREF.set(key + ":" + name, "");
  await Spaces.remove(name);
  clearMemo(); render();
  return true;
}
