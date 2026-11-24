/* An update pasted anywhere (#373 reopened): what it would change on the
   tasks it answers, or null when it is no update or changes nothing. Read
   like Paste a reply reads it; a task is found by its reference, or by its
   words. Per task: done (an open task they say is done), due (a date after
   by, on, due, until or before in their words), note (their words) and ack
   (Got it). who: whoever the tasks are waiting on, as the reply does. */
function pastedUpdate(raw) {
  let data = null;
  try { data = parseUpdateReply(raw); } catch (e) { return null; }
  if (!data || !data.items || !data.items.length) return null;
  const rows = [], seen = new Set(), owners = new Map();
  for (const item of data.items) {
    const hit = resolveReplyItem(item);
    if (!hit || seen.has(hit.block)) continue;
    seen.add(hit.block);
    const note = trim(item.note || "");
    const done = !!item.done && !!OPEN_STATES[hit.block.state];
    const by = PASTED_UPDATE_BY_RE.exec(note);
    let due = by ? dateFromWords(by[1]) : null;
    if (due && inSpace(hit.space, () => dueDate(hit.block)) === due) due = null;
    const ack = !!item.ack && !done && !note;
    if (!done && !due && !note && !ack) continue;
    rows.push({hit, done, due, note, ack});
    const owner = inSpace(hit.space, () => leafActions().find(a => a.block === hit.block)?.assignee
      || peopleOnLine(hit.block).find(n => !samePerson(n, whoAmI())));
    if (owner) owners.set(owner, (owners.get(owner) || 0) + 1);
  }
  if (!rows.length) return null;
  const who = trim(data.who || "") || [...owners].sort((x, y) => y[1] - x[1])[0]?.[0] || trim(data.from || "") || "They";
  return {who, rows};
}
