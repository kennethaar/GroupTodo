/* The meetings in the days: on your day pages, or anywhere with date::. */
function weekMeetingsHere(days) {
  const out = [], mine = new Map(days.map(d => [journalPath(d), d]));
  for (const [path, page] of V.pages) {
    const onDay = mine.get(path);
    if (isJournalPath(path) && !onDay) continue;
    walkBlocks(page.blocks, b => {
      if (!isMeeting(b) || /^#meeting Cancelled:/i.test(b.title) || b.state === "CANCELLED") return;
      const day = onDay || dateIn(blockProp(b, "date"));
      if (!day || !days.includes(day)) return;
      const c = meetingClock(b);
      out.push({event: true, day, path, block: b, title: meetingTitle(b),
        time: c ? pad2(Math.floor(c.start / 60)) + ":" + pad2(c.start % 60) : null});
    });
  }
  return out;
}
