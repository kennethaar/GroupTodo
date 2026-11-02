function suggestFor(host, opts) {
  const before = textBeforeCaret(host);
  if (before == null) return null;
  if (opts.commands && !insideLink(before)) {
    const sm = /(^|\s)\/([\p{L}]*)$/u.exec(before);
    const rows = sm ? slashRows(sm[2]) : [];
    if (rows.length) return {mode: "slash", at: before.length - sm[2].length - 1, rows};
  }
  if (opts.trackers) {
    const tm = /^tracker-([\p{L}\p{N}_-]*)$/iu.exec(before);
    if (tm) return {mode: "tracker", at: 0, rows: trackerSuggestRows(tm[1])};
    // Its values are numbers like 100/8/4, not dates or names to look up.
    if (/^tracker-[^:]*::/i.test(before)) return null;
  }
  const link = openLinkAt(before);
  if (link) {
    const rows = linkCandidates(link.query).map(r => Object.assign({kind: r.kind || "page", accept: "link"}, r));
    return rows.length ? {mode: "link", at: link.at, rows} : null;
  }
  if (insideLink(before)) return null;
  const trig = /(^|\s)(@@|@|#)([^\s@#\[\]]*)$/.exec(before);
  if (trig) {
    /* @ is a context, the way @phone reads on every task. People need no
       key of their own: the start of a name is offered as you type it.
       @@ is what contexts took before, and still means them. */
    const kind = trig[2] === "#" ? "project" : "context";
    const q = trig[3].toLowerCase();
    const kinds = [kind];
    const pool = nameIndex().filter(n => kinds.includes(n.kind))
      .sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind));
    /* A child context is found by its own name too: "@out" is Home/Outside,
       and "@outside" is that context, not a new one. */
    const leaf = t => t.toLowerCase().split("/").pop();
    const named = pool.filter(n =>
      !q || n.title.toLowerCase().split(/[\s/]+/).some(w => w.startsWith(q)) || n.title.toLowerCase().startsWith(q))
      .map(n => Object.assign({accept: "link"}, n));
    const rows = aliasRows(pool, q).concat(named).slice(0, 8);
    if (q && kind === "context" && !rows.some(r => r.title.toLowerCase() === q || leaf(r.title) === q || r.exact))
      rows.push({kind, title: q, ref: "c/" + slugify(q), accept: "link", isNew: true});
    return rows.length ? {mode: "trigger", at: before.length - trig[2].length - trig[3].length, rows} : null;
  }
  if (opts.typed === false) return null;
  // A name or a date being typed, word by word: the last four words at most,
  // so "neste onsdag kl 13" is read whole.
  const tail = /(?:^|\s)((?:[\p{L}\p{N}][\p{L}\p{N}'._-]*\s){0,3}[\p{L}\p{N}][\p{L}\p{N}'._-]*)$/u.exec(before);
  if (!tail) return null;
  const words = tail[1].split(/\s+/);
  for (let n = words.length; n >= 1; n--) {
    const frag = words.slice(words.length - n).join(" ");
    if (frag.length < 2 || frag.toLowerCase() === SUGGEST_DISMISSED) continue;
    const f = frag.toLowerCase();
    const names = nameIndex().filter(x => x.kind !== "context" && (
      x.title.toLowerCase().startsWith(f) ||
      (n === 1 && f.length >= 3 && x.title.toLowerCase().split(/\s+/).some(w => w.startsWith(f)))))
      .filter(x => x.title.toLowerCase() !== f || x.kind !== "context")
      .slice(0, 5).map(x => Object.assign({accept: "link"}, x));
    // "storebrand" is Storebrand Forsikring AS, written the way it was said.
    const aliased = aliasRows(nameIndex().filter(x => x.kind !== "context"), f).slice(0, 3);
    const dates = opts.dates ? dateSuggestions(frag).map(r => Object.assign({accept: "date"}, r)) : [];
    const rows = dates.concat(aliased, names);
    if (rows.length) return {mode: "word", at: before.length - frag.length, rows};
  }
  return null;
}
