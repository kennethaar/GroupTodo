function todaysMeetings(day = todayISO()) {
  const today = day;
  const out = [];
  for (const name of LOADED.keys()) inSpace(name, () => {
    for (const m of memo("meetings\u0000" + name + "\u0000" + today + "\u0000" + V.pages.size, () => {
      const found = [];
      const mine = journalPath(today);
      for (const [path, page] of V.pages) {
        const onDay = path === mine;
        if (isJournalPath(path) && !onDay) continue;
        walkBlocks(page.blocks, b => {
          if (!isMeeting(b) || /^#meeting Cancelled:/i.test(b.title) || b.state === "DONE" || b.state === "CANCELLED") return;
          if (!onDay && dateIn(blockProp(b, "date")) !== today) return;
          const clock = meetingClock(b);
          if (clock) found.push({path, block: b, clock});
        });
      }
      return found;
    })) {
      const d = parseISO(today);
      const at = mins => new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(mins / 60), mins % 60).getTime();
      const start = at(m.clock.start);
      out.push({space: name, path: m.path, block: m.block, title: meetingTitle(m.block) || "Meeting",
        start, end: m.clock.end != null ? at(m.clock.end) : start + 30 * 6e4,
        key: today + "\u0000" + name + "\u0000" + (blockProp(m.block, "cal_uid") || meetingTitle(m.block)) + "\u0000" + m.clock.start});
    }
  });
  return out.sort((a, b) => a.start - b.start);
}
