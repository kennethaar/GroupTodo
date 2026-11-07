/* ---------- what comes first: a loose action goes under the one that waits for it (#275) ---------- */
// key -> the key of the action that waits for it; "" when nothing does.
const npmBefore = () => NPM.before || (NPM.before = {});
// The action a line goes under, while it is still one of the loose ones.
const npmParent = (key, loose) => { const p = npmBefore()[key]; return p && loose.some(x => x.key === p) ? p : null; };
// Putting key under p is a loop when key is above p already.
const npmLoops = (key, p, loose) => {
  for (let x = p, n = 0; x && n <= loose.length; x = npmParent(x, loose), n++) if (x === key) return true;
  return false;
};
const npmUnplaced = loose => loose.filter(x => !(x.key in npmBefore()));
