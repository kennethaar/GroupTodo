function onBranchCut(e) {
  if (!e.clipboardData) return;
  const cut = branchToCut(e);
  if (!cut) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  e.clipboardData.setData("text/plain", cut.text);
  PENDING_BRANCH_CUT = cut;
}
