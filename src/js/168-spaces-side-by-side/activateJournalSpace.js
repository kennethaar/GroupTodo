/* Point the app at the space a column belongs to, so edits made there land in
   that space's files. */
function activateJournalSpace(name) {
  if (!LOADED.has(name)) return;
  Spaces.active = name;
  bindActive(name);
  clearMemo();
  for (const n of document.querySelectorAll(".space-journal"))
    n.classList.toggle("active-space", n.dataset.space === name);
}
