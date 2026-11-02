async function autoSyncLinked() {
  if (!autoSyncOn() || !CAP.savePicker) return;   // no durable handle, nothing to sync
  if (busyEditing()) return;
  if (Date.now() - AUTOSYNC_AT < 20000) return;        // never hammer the disk
  let h = null;
  try { h = await linkedHandle(); } catch (_) {}
  if (!h) return;
  try { if ((await h.queryPermission({mode: "readwrite"})) !== "granted") return; }
  catch (_) { return; }
  AUTOSYNC_AT = Date.now();
  await syncLinked({quiet: true});
}
