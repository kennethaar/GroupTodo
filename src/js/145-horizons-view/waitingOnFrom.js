/* What this person owes you: anything open with their name on it. WAIT is the
   usual shape, but a TODO somebody handed to a name the app does not know is
   the same debt wearing different clothes. */
function waitingOnFrom(name) {
  if (!name) return [];
  const actions = leafActions().filter(a =>
    OPEN_STATES[a.state] && waitsOn(a).some(n => samePerson(n, name)) &&
    !samePerson(name, whoAmI()));
  const row = globalPeopleRows().find(r => samePerson(r.name, name));
  for (const a of row?.items || [])
    // The block itself says it is the same task: with one area showing, the
    // rows from leafActions carry no area name while these always do.
    if (!actions.some(x => x.block === a.block)) actions.push(a);
  return actions;
}
