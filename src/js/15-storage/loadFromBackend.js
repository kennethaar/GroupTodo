async function loadFromBackend(backend, {quick = false} = {}) {
  setSync("sync", "loading...");
  const name = Spaces.active || "Personal";
  /* What is in memory was read from browser storage while the folder waited
     for its permission. Shown while the folder is read behind it, the day was
     that copy. So the folder is read as at start-up, today first. Nothing in
     the old copy is lost: it was all saved to browser storage before this
     (openSpace flushes first), and that is merged into the folder's pages,
     line by line, once they are in (mergeMirror). An area with a save still
     outstanding keeps the old way (#232). */
  const held = LOADED.get(name);
  if (held && held.backend && backend.kind === "fs" && held.backend.kind !== "fs" &&
      !held.dirty.size && !held.removed.size) { readFolderBehind(held, backend); return; }
  /* An area already read in -- shown beside another, or looked at from
     Horizons -- opens from what is in memory at once, and is read again from
     its folder behind your back, so a big folder no longer holds the door. */
  if (quick && LOADED.has(name)) {
    const rec = LOADED.get(name);
    rec.backend = backend;
    bindActive(name);
    setSync("ok", backend.label);
    readInto(rec).then(() => {
      if (rec.hold) { showHoldDialog(name); setSync("warn", "not saving - folder looks empty"); }
      if (V.space !== name) return;
      bindActive(name); clearMemo();
      renderUnlessTyping();
    }).catch(() => {});
    return;
  }
  const rec = LOADED.get(name) || newRecord(name, backend);
  rec.backend = backend;
  /* At start-up the day is drawn as soon as its page is in, and again with
     yesterday's, while the folder is still listed and read (#181). */
  const onDay = INIT_DONE ? null : r => {
    LOADED.set(name, r);
    bindActive(name);
    state.view = startView(); state.pagePath = null;
    SPACE_TRANSITION = false;
    renderUnlessTyping();
  };
  await readInto(rec, {stage: true, onRest: restLoaded, onSoon: soonLoaded, onDay});
  LOADED.set(name, rec);
  bindActive(name);
  setSync("ok", backend.label);
  if (V.raw.size) {
    notify(V.raw.size + " .org files found -- open Vault → Import .org to convert them.", "warn");
  }
}
