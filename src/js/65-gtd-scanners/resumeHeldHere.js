/* The day a dated hold:: arrives, the task it sits on is not a held task
   wearing a date that happens to have passed -- it is simply due again, so
   HOLD becomes TODO the way any other state does, not just a readout that
   quietly stops hiding it. Indefinite holds (HOLD_OPEN) never resolve here;
   only a hold with its own day, once that day is today or past. */
function resumeHeldHere(today) {
  const out = [];
  for (const a of leafActionsHere()) {
    const b = a.block;
    if (b.state !== "HOLD") continue;
    const own = holdValue(blockProp(b, "hold"));
    if (!own || own === HOLD_OPEN || own > today) continue;
    const before = {state: b.state, props: Object.assign({}, b.props)};
    b.state = "TODO";
    endHold(b.props, false);
    touch(a.path);
    out.push({path: a.path, block: b, before});
  }
  return out;
}
