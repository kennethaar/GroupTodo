function onBranchCutKey(e) {
  if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "x") return;
  const cut = branchToCut(e);
  if (!cut) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  PENDING_BRANCH_CUT = cut;
  copyText(cut.text, "Line ready to move. The original stays until you paste.", "Copy line");
}
