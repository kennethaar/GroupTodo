/* Every calendar comes into one area nobody else is in: your own. A day page
   there can be read by everyone in it, and a calendar holds more than its owner
   would hand out line by line: private appointments, who meets whom, agendas.
   Each person's import would also fill the shared day pages with their own
   meetings. So the whole calendar comes in there, and a meeting is shown in
   another area only when you say so -- for all of one calendar's meetings, or
   for one meeting -- as a synced copy of that meeting alone. Checked again on
   every fetch, since people can join an area after its link was added. */
/* Everybody else with a trace in an area: a member page, or a day page filed
   under their name. Member pages alone said "yours alone" about a colleague's
   folder whose people had never been asked their names. */
function areaOthers(space) {
  if (!LOADED.has(space)) return [];
  return inSpace(space, () => memo("areaOthers\u0000" + space, () => {
    const seen = new Map();
    const add = n => { const k = slugPerson(n || "").toLowerCase(); if (k && n !== "Untitled" && !isMe(n) && !seen.has(k)) seen.set(k, n); };
    for (const m of membersNow()) add(m.name);
    for (const p of V.pages.keys()) if (isJournalPath(p)) add(journalOwnerOf(p));
    return Array.from(seen.values());
  }));
}
