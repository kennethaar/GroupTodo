/* Back to a card this pass has already dealt past: the last one (Backspace),
   or one picked off the reviewed pile. It is dealt again on top, its answers
   as they are, with the first question open, so a wrong answer is one click
   from changed. */
function solBack(key = null) {
  if (SOL.moving || !SOL.order) return;
  const past = SOL.past || [];
  if (key == null) key = past.pop();
  if (key == null) return;
  SOL.past = past.filter(k => k !== key);
  const at = SOL.order.findIndex(r => solKey(r) === key);
  let r = null;
  if (at >= 0) { r = SOL.order.splice(at, 1)[0]; if (at < SOL.i) SOL.i--; }
  else if (key[0] !== "@") {
    // Reviewed before a reload: not in this deal, but its page is still there.
    const n = key.indexOf("|");
    r = {space: key.slice(0, n), path: key.slice(n + 1)};
    if (!inS(r, () => V.pages.has(r.path))) r = null;
  }
  if (!r) { notify("That card is not on the table any more. Its page may have been moved or deleted.", "warn"); return; }
  SOL.order.splice(SOL.i, 0, r);
  const ans = SOL_ANS.get(key);
  if (ans) { delete ans["p" + solPassNo()]; delete ans["t" + solPassNo()]; solSaveAns(); }
  Object.assign(SOL, {focus: null, more: null, hold: null, step: (solSteps()[0] || {}).k || null, shown: null});
  SOL_KB = null;
  render();
}
