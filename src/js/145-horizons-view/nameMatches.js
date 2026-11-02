/* ---------- claiming what was waiting for you ----------
   Before you existed here, a colleague could only name you: "assigned:: Kenneth"
   on somebody who was not a member became a WAIT, because nobody in the space
   could tick it off. The moment you arrive that stops being true, so the app
   offers you the pile.

   Claiming does not take anything away from them. The row is the same row --
   they wrote it, so it stays in their Waiting for -- it just becomes a live
   task in your name rather than a note that they are waiting on an outsider. */
function nameMatches(assigned, me) {
  if (samePerson(assigned, me)) return true;
  const a = slugPerson(assigned).toLowerCase().split(/\s+/).filter(Boolean);
  const m = slugPerson(me).toLowerCase().split(/\s+/).filter(Boolean);
  if (!a.length || !m.length) return false;
  // "Kenneth" matches "Kenneth Aar"; "Kenneth Berg" does not.
  return a.every(t => m.includes(t));
}
