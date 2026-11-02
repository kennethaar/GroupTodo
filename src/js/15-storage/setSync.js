function setSync(state, text) {
  const dot = $("#syncDot"), txt = $("#syncTxt");
  if (!dot) return;
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
  if (away && state === "ok") dot.className = "dot warn";
  if (reading && state === "ok") dot.className = "dot sync";
  txt.textContent = (state === "ok" && reading) ? "reading the folder..."
    : (state === "ok" && away) ? "folder not connected"
    : (state === "ok" && !onDisk) ? "browser only - no files" : text;
  txt.title = onDisk ? "Saving to " + (V.backend.label || "")
    : reading ? "The folder is being read. What you do meanwhile goes to it once it is in."
    : "Nothing in this area is written to disk";
}
