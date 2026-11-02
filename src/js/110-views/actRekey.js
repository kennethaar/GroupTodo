// An answer that changes the line's words or page moves its answers along with it.
function actRekey(r, fn) {
  const was = solKey(r);
  fn();
  const now = solKey(r);
  if (now === was || !SOL_ANS.has(was)) return;
  SOL_ANS.set(now, Object.assign(SOL_ANS.get(now) || {}, SOL_ANS.get(was)));
  SOL_ANS.delete(was);
}
