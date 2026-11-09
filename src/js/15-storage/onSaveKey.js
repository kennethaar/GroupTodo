function onSaveKey(e) {
  if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
  if ((e.key || "").toLowerCase() !== "s" && e.code !== "KeyS") return;
  e.preventDefault();
  e.stopPropagation();
  saveEverythingNow();
}
