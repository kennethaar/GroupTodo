async function refreshFromServer() {
  const rec = LOADED.get(Spaces.active);
  if (!rec || !rec.backend || rec.backend.kind !== "http") return;
  if (busyEditing() || V.syncing) return;
  if (Date.now() - SERVER_READ_AT < 10000) return;
  SERVER_READ_AT = Date.now();

  if (rec.dirty.size || rec.removed.size) {
    await flush();
    if (V.error) return;                        // server unreachable; keep ours
  }
  try {
    const before = pageSignature(rec);
    await readInto(rec);
    if (rec.hold) { showHoldDialog(rec.name); setSync("warn", "not saving - server looks empty"); return; }
    bindActive(rec.name);
    if (pageSignature(rec) !== before) {
      scanVerbs();
      ensureJournal(todayISO());
      render();
      notify("Updated from " + rec.backend.label + ".");
    }
  } catch (_) {
    setSync("warn", "offline");                 // nothing lost: ours is intact
  }
}
