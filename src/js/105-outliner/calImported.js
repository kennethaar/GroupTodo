/* Every calendar that has meetings on the day pages of an area that is yours
   alone, with how many and over which days. A shared area is left out: a
   meeting sent on there is the others' too. */
function calImported() {
  const out = new Map();
  for (const space of Spaces.list.map(s => s.name).filter(n => LOADED.has(n) && !calAreaShared(n)))
    inSpace(space, () => {
      for (const p of allPages(isJournalPath)) {
        const d = dayOfPath(p);
        if (d) walkBlocks(getPage(p).blocks, b => {
          const feed = blockProp(b, "cal_feed");
          if (!feed) return;
          const k = space + "\n" + feed;
          const g = out.get(k) || {space, feed, n: 0, first: d, last: d, sample: ""};
          g.n++;
          if (d < g.first) g.first = d;
          if (d > g.last) g.last = d;
          if (!g.sample) g.sample = trim(b.title.replace(MEETING_RE, " "));
          out.set(k, g);
        });
      }
    });
  return [...out.values()];
}
