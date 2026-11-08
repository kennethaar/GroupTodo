/* The words of a word list, on a line that starts with its mark (#214). After
   two letters: the words that start so, from any ring, with the words under
   them, each saying where it sits. A whole word: the ring under it, so a pick
   goes one ring further out. {stop} when the line has an outer word and
   nothing more is to be offered; null to leave the line to names and dates. */
function wordSuggest(before) {
  for (const mark of wordListMarks()) {
    const m = new RegExp("^" + mark.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[ \\t\\u00A0]+").exec(before);
    if (!m) continue;
    const q = trim(before.slice(m[0].length).replace(/ /g, " ")).toLowerCase();
    if (q.length < 2 || q === SUGGEST_DISMISSED) return null;
    const all = [];
    const walk = (ts, path) => ts.forEach(t => { all.push({t, path}); walk(t.kids, path.concat(t.name)); });
    walk(wordsForLines(mark), []);
    const row = x => ({accept: "word", title: x.t.name, mark: x.t.kids.length ? "›" : "·",
      detail: x.path.length ? x.path.join(" › ") : mark === "=" ? "core feeling" : "broad word"});
    const at = m[0].length;
    const whole = all.find(x => x.t.name.toLowerCase() === q);
    if (whole) {
      if (!whole.t.kids.length) return {stop: true};
      const path = whole.path.concat(whole.t.name);
      return {mode: "words", at, head: path.join(" › "), rows: whole.t.kids.map(t => row({t, path}))};
    }
    const starts = s => s.toLowerCase().startsWith(q) || s.toLowerCase().split(/\s+/).some(w => w.startsWith(q));
    const own = all.filter(x => starts(x.t.name));
    const under = all.filter(x => !own.includes(x) && x.path.some(starts));
    const rows = own.concat(under).slice(0, 8).map(row);
    return rows.length ? {mode: "words", at, rows} : null;
  }
  return null;
}
