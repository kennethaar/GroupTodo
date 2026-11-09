/* Ctrl+S, pressed out of habit before closing (#337): the line being typed
   is written to its page, every open area is saved now, and the sync line
   then says so, with the time. */
async function saveEverythingNow() {
  const a = document.activeElement;
  if (a && a.closest?.(".blk") && a.isContentEditable) a.dispatchEvent(new CustomEvent("gtd:commit"));
  else if (a && a !== document.body && a.matches?.("input, textarea, select, [contenteditable]")) { a.blur(); a.focus(); }
  await saveNow();
  const words = $("#syncTxt")?.textContent || "";
  notify(words, $("#syncDot")?.classList.contains("ok") ? "info" : "warn");
}
