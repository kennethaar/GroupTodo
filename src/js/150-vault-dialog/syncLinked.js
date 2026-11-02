/* Read the file, merge what is new, write the merged vault back. */
async function syncLinked({quiet = false} = {}) {
  const h = await linkedHandle();
  if (!h) { if (!quiet) notify("No linked vault file yet.", "warn"); return; }
  try {
    if ((await h.queryPermission({mode: "readwrite"})) !== "granted") {
      if (quiet) return;                 // asking needs a click; wait for one
      if ((await h.requestPermission({mode: "readwrite"})) !== "granted") {
        notify("Permission to the vault file was declined.", "warn");
        return;
      }
    }
    await filesLoaded();               // merge into whole pages, not stand-ins
    setSync("sync", "syncing...");
    const existing = await (await h.getFile()).text().catch(() => "");
    const incoming = parseBundle(existing);
    const report = incoming.size ? mergeBundle(incoming)
                                 : {added: 0, updated: 0, merged: 0, kept: 0, conflicts: 0, deleted: 0};
    await mergeBundleAssets(existing);
    await flush();
    const w = await h.createWritable();
    await w.write(await bundleWithAssets());
    await w.close();
    setSetting("last_sync", nowStamp());
    setSync("ok", V.backend ? V.backend.label : "synced");
    const changed = report.added + report.updated + report.merged + report.deleted;
    markSent();
    if (changed || !quiet) markImported();
    if (!quiet) notify(syncSummary(report) + " Vault file written.");
    else if (changed) notify(syncSummary(report));     // silent unless it brought something in
    render();
  } catch (e) {
    setSync("err", "sync failed");
    if (!quiet) notify("Sync failed: " + e.message, "error");
  }
}
