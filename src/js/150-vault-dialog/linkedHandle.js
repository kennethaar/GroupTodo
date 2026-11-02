async function linkedHandle() {
  if (LINKED) return LINKED;
  try {
    /* Permission, not the handle, is what a fresh download loses. Hand the
       handle back either way: syncLinked() asks for permission on the click
       that called it, and autoSyncLinked() checks for itself before it writes,
       so neither of them needs the file chosen a second time. */
    const h = await IDB.get("kv", "bundle:" + Spaces.active);
    if (h) return (LINKED = h);
  } catch (_) {}
  return null;
}
