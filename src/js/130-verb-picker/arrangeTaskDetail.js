function arrangeTaskDetail(path, block, home, focus) {
  const sheet = $("#modalRoot .modal");
  if (!sheet) return;
  Object.assign(sheet.dataset, {space: home, path, blockId: block.id});
  // Every edit in this panel is routed to its owning space, keyboard saves included.
  sheet.addEventListener("pointerdown", () => activateJournalSpace(home), true);
  sheet.addEventListener("focusin", () => activateJournalSpace(home), true);
  if (focus === "date") focusTaskDetailDate(sheet);
}
