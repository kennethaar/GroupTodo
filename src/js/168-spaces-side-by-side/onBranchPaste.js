function onBranchPaste(e) {
  if (!PENDING_BRANCH_CUT || $("#modalRoot").firstChild) return;
  const raw = e.clipboardData?.getData("text/plain");
  if (trim(raw) !== trim(PENDING_BRANCH_CUT.text)) return;
  const dest = itemContext(e.target);
  if (!dest?.path) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const pending = PENDING_BRANCH_CUT;
  if (dest.space === pending.ctx.space) { PENDING_BRANCH_CUT = null; moveBranchHere(pending.ctx, dest); return; }
  (async () => {
    const choice = await chooseItemTransfer(pending.ctx, dest.space, "move");
    if (!choice) return;
    try {
      if (await runItemTransfer(pending.ctx, dest.space, choice, dest)) PENDING_BRANCH_CUT = null;
    } catch (err) { notify(err.message, "error"); }
  })();
}
