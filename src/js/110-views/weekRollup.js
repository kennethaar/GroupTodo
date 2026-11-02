/* day -> what is dated on it, in the order you meet it: the times, what is
   due, what you wait for, what starts. */
function weekRollup(id) {
  const days = weekDays(id), today = todayISO();
  return memo("weekRollup\u0000" + id + "\u0000" + today, () => {
    const by = new Map(days.map(d => [d, []]));
    const put = (d, it) => { const l = by.get(d); if (l) l.push(it); };
    const place = a => {
      const end = taskEnd(a.block), start = taskStart(a.block), open = !!OPEN_STATES[a.state];
      if (!end) return;
      if (start) put(start, {a, kind: "start"});
      // Waited for past its day is still waiting: that is for the review to chase.
      const w = dueWhen(a.block), wait = a.state === "WAIT";
      const late = open && !wait && end < today ? dateDiffDays(end, today) : 0;
      put(end, {a, time: w && w.day === end ? w.time : null, late, kind: wait ? "wait" : late ? "late" : "due"});
    };
    myOpen().forEach(place);
    acrossSpaces(() => weekDoneHere(days[0], days[6])).forEach(place);
    acrossSpaces(() => weekMeetingsHere(days)).forEach(m => put(m.day, m));
    const rank = it => it.time ? 0 : it.event || it.kind === "late" || it.kind === "due" ? 1 : it.kind === "wait" ? 2 : 3;
    for (const l of by.values()) l.sort((x, y) => rank(x) - rank(y) || (x.time || "").localeCompare(y.time || ""));
    return by;
  });
}
