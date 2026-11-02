/* Carry out a transfer the user has chosen: a branch, or the whole file. */
async function runItemTransfer(ctx, target, choice, destination = null) {
  if (choice.scope === "branch") return transferBranch(ctx, target, choice, destination);
  return transferLinkedPages([{path: ctx.path, from: ctx.space}], target, {mode: choice.mode});
}
