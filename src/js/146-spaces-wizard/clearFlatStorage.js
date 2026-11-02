async function clearFlatStorage() {
  // The placeholder space wrote to the un-namespaced keys; nothing there is
  // the user's, it is only auto-seeded scaffolding.
  try {
    for (const k of await IDB.keys("files")) if (!String(k).includes("|")) await IDB.del("files", k);
  } catch (_) {}
  try { for (const k of LS.all().keys()) if (!k.includes("|")) LS.del(k); } catch (_) {}
}
