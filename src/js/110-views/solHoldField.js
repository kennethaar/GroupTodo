/* The on hold pass's one question. Not one of solFields(): those are what a
   project is missing everywhere it is shown, and a hold is not missing from
   the projects that have none. Kept as it is, it stays held to the same day;
   taken off, its actions are back on your lists at once. */
function solHoldField() {
  const day = r => holdValue(pageProp(r.space, r.path, "hold"));
  return {k: "hold", label: "Still on hold?", type: "date",
    opts: r => [
      ["keep", "Still on hold" + (day(r) === HOLD_OPEN ? ", no date" : day(r) ? ", until " + humanDate(day(r)) : "")],
      ["off", "Take it off hold: it can be done now"],
      ...(day(r) === HOLD_OPEN ? [] : [[HOLD_OPEN, "Keep on hold, no date"]]),
      ...["w1", "m1", "q1", "h1"].map(k => [solEndOf(k), "Hold until the end of " + SOL_ENDS.find(([x]) => x === k)[1].toLowerCase()])],
    cur: () => null,
    val: r => solHeld(r) ? (day(r) === HOLD_OPEN ? "no date" : "until " + humanDate(day(r))) : "off hold",
    filled: r => !!solAns(r).hold,
    pick: (r, v) => {
      solAns(r).hold = true;
      if (v !== "keep") inS(r, () => setProjectHold(r.path, v === "off" ? null : v));
    }};
}
