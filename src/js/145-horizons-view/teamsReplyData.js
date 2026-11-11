/* What a Teams reply says, from the lines still ticked (#352), in the shape
   openUpdateArrived reads: the words on each task, done where they said so,
   and words about no one task as loose, for you to place. A plain thanks is
   Got it for all of them, as it is in a mail. */
function teamsReplyData(t) {
  const on = t.lines.filter(l => l.on);
  const base = {from: t.from, refs: t.refs, teams: t};
  if (on.length && on.every(l => !l.done && MAIL_THANKS_RE.test(l.said)))
    return Object.assign(base, {loose: "",
      items: t.refs.map(ref => ({ref, t: "", numbered: true, ack: true, done: false, note: ""}))});
  const items = t.refs.map(ref => {
    const said = on.filter(l => l.ref === ref);
    return said.length ? {ref, t: "", numbered: true, done: said.some(l => l.done),
      note: said.map(l => l.said).filter(Boolean).join(" ")} : null;
  }).filter(Boolean);
  return Object.assign(base, {items, loose: on.filter(l => l.ref === null).map(l => l.text).join(" ")});
}
