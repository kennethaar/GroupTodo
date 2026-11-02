function meetClashes(b, page) {
  const c = meetLeads(b) && meetLive(b) ? meetingClock(b) : null;
  if (!c || !page) return [];
  const end = x => x.end != null ? x.end : x.start + 30;
  const out = [];
  walkBlocks(page.blocks, o => {
    if (o === b || !meetLeads(o) || !meetLive(o)) return;
    const k = meetingClock(o);
    if (c.start < end(k) && k.start < end(c)) out.push(meetingTitle(o) || "a meeting");
  });
  return out;
}
