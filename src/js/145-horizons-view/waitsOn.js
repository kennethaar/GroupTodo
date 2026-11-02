/* Who a line waits on: whoever it was handed to, or, for a WAIT handed to
   nobody, everybody it links. "[[p/Juta]] og [[p/Ola]] skriver to artikler"
   waits on both of them, though it cannot be handed to either. */
function waitsOn(a) {
  if (a.assignee) return [a.assignee];
  if (a.state !== "WAIT") return [];
  const me = whoAmI(), out = [];
  for (const n of peopleOnLine(a.block || a))
    if (!samePerson(n, me) && !out.some(o => samePerson(o, n))) out.push(n);
  return out;
}
