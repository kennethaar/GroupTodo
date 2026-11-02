const solAns = r => SOL_ANS.get(solKey(r)) || (SOL_ANS.set(solKey(r), {}), SOL_ANS.get(solKey(r)));
const solIdle = r => inSpace(r.space, () => {
  const p = getPage(r.path)?.props || {};
  const d = dateIn(p.reviewed || "") || dateIn(p.created || "");
  return d ? dateDiffDays(d, todayISO()) : null;
});
/* Active projects are the ones the review is for. Waiting and someday/maybe
   come along only when you ask for them. A project on hold sits out the
   passes for what is active -- nobody is meant to be doing it yet -- and has
   a pass of its own after them, which asks only whether it still is. */
const solAll = () => PREF.get("sol.all", "") === "1";
const solHeld = r => !!inS(r, () => projectHold(r.path));
// On hold with no date: those have a pass of their own, two at a time, before Someday.
const solOpenHold = r => inS(r, () => projectHold(r.path)) === HOLD_OPEN;
