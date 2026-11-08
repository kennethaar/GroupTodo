/* Each intention's net score week by week, counted from every #reflection
   pick in the journal (#210): a Toward adds one, an Away takes one. An event
   picked in two weeks' reflections counts once, as its latest pick. The week
   comes from the page the pick is on, since the line's title has no year.
   Every week with a linked pick is a point on the chart. */
function intentionScores() {
  return memo("intentionScores", () => {
    const last = new Map(), seen = new Set();
    for (const [path, page] of V.pages) {
      if (!isJournalPath(path)) continue;
      const name = baseName(path), week = WEEK_RE.test(name) ? name : weekOf(name);
      if (!week) continue;
      for (const r of page.blocks) if (REFLECTION_RE.test(r.title || "")) for (const k of r.children || []) {
        const m = PICK_RE.exec(k.title || ""), ev = m && m[2].toLowerCase();
        if (m && m[3]) seen.add(week);
        if (m && m[3] && !(last.get(ev)?.week > week))
          last.set(ev, {week, aim: m[3].toLowerCase(), n: m[1].toLowerCase() === "toward" ? 1 : -1});
      }
    }
    const net = new Map();
    for (const p of last.values()) {
      const by = net.get(p.aim) || new Map();
      net.set(p.aim, by.set(p.week, (by.get(p.week) || 0) + p.n));
    }
    const weeks = [...seen].sort();
    const total = aim => [...(net.get(aim)?.values() || [])].reduce((a, n) => a + n, 0);
    return {weeks, net, total};
  });
}
