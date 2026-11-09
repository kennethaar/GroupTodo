/* The sync line says in words whether it is safe to close (#337). Green is
   "All saved to disk" and the time; the folder's name is in the tooltip. A
   line being typed is only a draft on this device until it is left, so it
   is counted too: green has to mean everything is in the files. */
function drawSync() {
  const dot = $("#syncDot"), txt = $("#syncTxt"), btn = $("#syncLine");
  if (!dot) return;
  const [state, text] = SYNC_SHOWN;
  dot.className = "dot " + state;
  // "browser storage" reads like a destination. It is not a folder, and people
  // go looking for files that were never written, so say so outright.
  const onDisk = V.backend && (V.backend.kind === "fs" || V.backend.kind === "http");
  // A folder area without its folder is not "browser only" by choice (#164).
  const away = !onDisk && folderMissing(V.space);
  /* Allowed back, the folder is read behind the browser copy, and on a phone
     that takes minutes. Every save meanwhile said "browser only", as if the
     folder had not been allowed at all. */
  const reading = !onDisk && FOLDER_READING.has(V.space);
  const typing = state === "ok" && !reading && !away && readLineDraft();
  if (away && state === "ok") dot.className = "dot warn";
  if (reading && state === "ok") dot.className = "dot sync";
  if (typing) dot.className = "dot warn";
  txt.textContent = typing ? "1 line being typed - not saved yet"
    : (state === "ok" && reading) ? "reading the folder..."
    : (state === "ok" && away) ? "folder not connected"
    : (state === "ok" && !onDisk) ? "browser only - no files"
    : (state === "ok") ? "All saved to disk · " + SAVED_AT : text;
  // Every save that finishes passes the folder's name: kept for the tooltip.
  const where = onDisk ? ((state === "ok" && text) || V.backend.label || "") : "";
  btn.title = typing ? "Leave the line, or press Ctrl+S, to save it."
    : onDisk ? "Saving to " + where + (state === "ok" && SAVED_AT ? ". Last saved " + SAVED_AT : "") + ". Click for Vault & sync."
    : reading ? "The folder is being read. What you do meanwhile goes to it once it is in."
    : "Nothing in this area is written to disk";
}
