/* What each client has not been billed for, up to a day: the stopped clocks
   on the todos of its projects, less what billed:: says is billed already,
   and its share of the prices on done tasks there. A project with
   billable:: no is left out. A time line per project, at rate:: on the
   project or else on the organisation; a line per priced task. */
function unbilledByClient(upTo) {
  upTo = upTo || todayISO();
  return memo("unbilled:" + upTo, () => {
    const by = new Map();
    const client = name => {
      const k = name.toLowerCase();
      if (!by.has(k)) by.set(k, {name, min: 0, since: null, amount: {}, lines: [], byProj: new Map()});
      return by.get(k);
    };
    const add = (into, cur, n) => { into[cur] = Math.round(((into[cur] || 0) + n) * 100) / 100; };
    acrossSpaces(() => {
      const space = V.space;
      for (const t of allTasksHere()) {
        const proj = t.projectPath && pageKind(t.projectPath) === "project" ? t.projectPath : null;
        if (!proj || (t.assignee && !isMe(t.assignee))) continue;
        if (/^(no|false|0)$/i.test(pageProp(space, proj, "billable"))) continue;
        const shares = clientShares({space, path: proj});
        const clocks = blockClocks(t.block).filter(c => !c.running && c.day <= upTo).sort((a, b) => a.day.localeCompare(b.day));
        const prices = t.state === "DONE" ? pricesIn(t.title) : [];
        if (!shares.length || (!clocks.length && !prices.length)) continue;
        const billed = billedEntries(t.block);
        for (const {name, pct} of shares) {
          const had = billed.find(e => e.name.toLowerCase() === name.toLowerCase());
          const c = client(name);
          let rest = had && had.min || 0, fresh = 0, total = 0, since = null;
          for (const k of clocks) {
            const m = k.min * pct / 100, take = Math.min(rest, m);
            rest -= take; total += m;
            if (m - take >= 0.5) { fresh += m - take; since = since || k.day; }
          }
          if (fresh >= 0.5) {
            if (!c.byProj.has(space + "\0" + proj)) {
              const rate = pricesIn(pageProp(space, proj, "rate") || inSpace(space, () => orgProp(name, "rate")))[0] || null;
              const line = {kind: "time", title: pageTitle(proj), path: proj, space, min: 0, rate, amount: {}, since: null, todos: []};
              c.byProj.set(space + "\0" + proj, line);
              c.lines.push(line);
            }
            const line = c.byProj.get(space + "\0" + proj);
            line.min += fresh;
            line.todos.push({block: t.block, path: t.path, space, stamp: Math.max(total, had && had.min || 0)});
            if (!line.since || since < line.since) line.since = since;
          }
          if (prices.length && !(had && had.price)) {
            const amount = {};
            for (const p of prices) add(amount, p.cur, p.amount * pct / 100);
            c.lines.push({kind: "price", title: t.title, path: proj, space, pct, amount,
              todos: [{block: t.block, path: t.path, space}]});
          }
        }
      }
    });
    const out = [];
    for (const c of by.values()) {
      if (!c.lines.length) continue;
      for (const l of c.lines) if (l.kind === "time") {
        l.min = Math.round(l.min);
        if (l.rate) add(l.amount, l.rate.cur, l.rate.amount * l.min / 60);
        c.min += l.min;
        if (!c.since || l.since < c.since) c.since = l.since;
      }
      for (const l of c.lines) for (const [cur, n] of Object.entries(l.amount)) add(c.amount, cur, n);
      c.lines.sort((a, b) => (a.kind === "price") - (b.kind === "price") || a.title.localeCompare(b.title));
      delete c.byProj;
      out.push(c);
    }
    return out.sort((a, b) => (a.since || "9").localeCompare(b.since || "9") || a.name.localeCompare(b.name));
  });
}
