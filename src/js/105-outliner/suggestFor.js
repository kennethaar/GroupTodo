function suggestFor(host, opts) {
  const before = textBeforeCaret(host);
  if (before == null) return null;
  if (opts.commands && !insideLink(before)) {
    const sm = /(^|\s)\/([\p{L}]*)$/u.exec(before);
    const rows = sm ? slashRows(sm[2]) : [];
    if (rows.length) return {mode: "slash", at: before.length - sm[2].length - 1, rows};
  }
  // "(" at the start of a page's line: the slide layouts, narrowed by letters (#481).
  const lm = opts.commands && /^\(([\p{L}\p{N}×]*)$/u.exec(before);
  if (lm) {
    const q = lm[1].toLowerCase();
    const rows = SLIDE_WORDS.filter(([w, lay]) => w.startsWith(q) || SLIDE_LAYOUTS[lay].name.toLowerCase().startsWith(q))
      .map(([word, lay, icon, hint]) => ({accept: "layout", word, title: SLIDE_LAYOUTS[lay].name, mark: icon, detail: hint}));
    if (rows.length) return {mode: "layout", at: 0, rows};
  }
  if (opts.trackers) {
    const tm = /^tracker-([\p{L}\p{N}_-]*)$/iu.exec(before);
    if (tm) return {mode: "tracker", at: 0, rows: trackerSuggestRows(tm[1])};
    // Its values are numbers like 100/8/4, not dates or names to look up.
    if (/^tracker-[^:]*::/i.test(before)) return null;
  }
  const book = bookSpaceOf(host), names = () => book ? bookNames(book) : nameIndex();
  const link = openLinkAt(before);
  if (link) {
    const rows = inSpace(book, () => linkCandidates(link.query)).map(r => Object.assign({kind: r.kind || "page", accept: "link"}, r));
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
    const pool = names().filter(n => kinds.includes(n.kind))
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
  if (opts.typed === false) {
    // #428 a click or a key put the caret in a known name not linked yet.
    const text = hostText(host);
    const at = before.length, hit = unlinkedNames(text, null, names()).find(s => s.at <= at && at <= s.end);
    if (!hit) return null;
    /* #455 "Anna: send the budget" is the shape of a waiting-for, so a
       known person opening a line with a colon is offered as one too. Only
       on a line of a page, which can turn waiting, and not one already so. */
    const word = text.slice(hit.at, hit.end), who = hit.rows.filter(r => r.kind === "person");
    const line = opts.commands && host.closest(".blk");
    const opens = line && who.length === 1 && !trim(text.slice(0, hit.at)) && /^\s*:/.test(text.slice(hit.end));
    const b = opens && findBlock(line.dataset.id)?.block;
    if (b && b.state !== "WAIT" && !isMe(who[0].title))
      return {mode: "unlinked", at: hit.at, end: hit.end, plain: true, rows: [
        Object.assign({}, who[0], {accept: "wait", title: "Add wait and link " + word, mark: "⏳", detail: ""}),
        Object.assign({}, who[0], {title: "Link " + word, detail: ""})]};
    return {mode: "unlinked", at: hit.at, end: hit.end, rows: hit.rows};
  }
  // On a = line, the Feelings Wheel's words before any name (#214).
  const wl = wordSuggest(before);
  if (wl) return wl.stop ? null : wl;
  // A name or a date being typed, word by word: the last four words at most,
  // so "neste onsdag kl 13" is read whole.
  const tail = /(?:^|\s)((?:[\p{L}\p{N}][\p{L}\p{N}'._-]*\s){0,3}[\p{L}\p{N}][\p{L}\p{N}'._-]*)$/u.exec(before);
  if (!tail) return null;
  const words = tail[1].split(/\s+/);
  for (let n = words.length; n >= 1; n--) {
    const frag = words.slice(words.length - n).join(" ");
    if (frag.length < 2 || frag.toLowerCase() === SUGGEST_DISMISSED) continue;
    const f = frag.toLowerCase();
    const found = names().filter(x => x.kind !== "context" && (
      x.title.toLowerCase().startsWith(f) ||
      (n === 1 && f.length >= 3 && x.title.toLowerCase().split(/\s+/).some(w => w.startsWith(f)))))
      .filter(x => x.title.toLowerCase() !== f || x.kind !== "context")
      .slice(0, 5).map(x => Object.assign({accept: "link"}, x));
    // "storebrand" is Storebrand Forsikring AS, written the way it was said.
    const aliased = aliasRows(names().filter(x => x.kind !== "context"), f).slice(0, 3);
    const dates = opts.dates ? dateSuggestions(frag).map(r => Object.assign({accept: "date"}, r)) : [];
    /* A plain word is never read as a context by itself (#315), so the pick
       is how "home" becomes @home: offered with the people, organisations and
       projects, by its own name or the name inside its folder. */
    const ctxs = n === 1 ? names().filter(x => x.kind === "context" &&
      (x.title.toLowerCase().split("/").some(w => w.startsWith(f)) || x.aliases.some(a => a.toLowerCase().startsWith(f))))
      .slice(0, 3).map(x => Object.assign({accept: "link"}, x)) : [];
    const rows = dates.concat(aliased, ctxs, found);
    if (rows.length) return {mode: "word", at: before.length - frag.length, rows};
  }
  return null;
}
