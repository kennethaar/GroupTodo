/* Tag with words selected (#335): making a page of those words comes first,
   then the names they most likely mean -- by alias, by the start of a word,
   inside the name, or a spelling or two away. A name that is already there
   word for word is first instead, and nothing is offered to be made again.
   `names` are the picker's own [value, label] rows; `prefix` is c, p or o. */
function tagSelOpts(names, prefix, text) {
  const q = trim(text).replace(prefix === "c" ? /^@/ : /^$/, "");
  const ql = q.toLowerCase();
  const near = (w, max) => Math.abs(w.length - ql.length) <= max && editDistance(w, ql) <= max;
  const max = ql.length < 4 ? 0 : ql.length < 8 ? 1 : 2;
  const hits = [];
  for (const [v, l] of names) {
    if (!v) continue;
    const t = v.toLowerCase(), words = t.split(/[\s/]+/);
    const own = nameByRef(prefix + "/" + v)?.aliases || pageAliasesByRef(prefix + "/" + v);
    const aliases = own.map(a => a.toLowerCase());
    const said = own.find(a => a.toLowerCase().startsWith(ql));
    const alias = aliases.includes(ql) ? 90 : said ? 70 : 0;
    const score = t === ql || words[words.length - 1] === ql && prefix === "c" ? 100
      : alias || (t.startsWith(ql) ? 65
      : words.some(w => w.startsWith(ql)) ? 60
      : t.includes(ql) ? 50
      : ql.split(/\s+/).every(w => words.some(x => x.startsWith(w))) ? 45
      : max && (near(t, max) || words.some(w => near(w, max)) || aliases.some(a => near(a, max))) ? 40
      : 0);
    if (score) hits.push({v, l: score === alias ? l + " · as " + said : l, score});
  }
  hits.sort((a, b) => b.score - a.score);
  const exact = hits.length && hits[0].score === 100;
  return [...(exact ? [] : [[q, "Create “" + q + "”"]]), ...hits.slice(0, 8).map(h => [h.v, h.l])];
}
