/* #428 Words on a line that name a known person, organisation, project or
   context but are not a link yet: [{at, end, rows}], rows ready for the
   suggest list. Its full name, an alias, or a person's first name.

   Only names, never ordinary words: a one-word name needs a capital and is
   found only as its page spells it, so "office" stays a word. A capital
   that only starts a sentence says nothing ("Review the budget"), except
   for a person or an organisation. A name the line already links, and
   links, code and addresses themselves, are left alone. `linked` lets a
   drawn line, whose links are no longer [[...]], say what it links. */
function unlinkedNames(text, linked = null, pool = nameIndex()) {
  const src = String(text || "");
  if (!src) return [];
  const done = new Set((linked || linksIn(src)).map(l => trim(String(l).split("][")[0]).toLowerCase()));
  const wants = new Map();
  const want = (word, n) => {
    word = trim(word || "");
    if (word.length < 3 || !/\p{Lu}/u.test(word) || done.has(n.ref.toLowerCase())) return;
    const rows = wants.get(word) || [];
    if (rows.some(r => r.ref === n.ref)) return;
    rows.push({accept: "link", kind: n.kind, title: n.title, ref: n.ref, space: n.space,
      label: word === n.title || n.kind === "context" ? undefined : word});
    wants.set(word, rows);
  };
  for (const n of pool) {
    if (!["person", "org", "project", "context"].includes(n.kind)) continue;
    want(n.title, n);
    for (const a of n.aliases || []) want(a, n);
    if (n.kind === "person") want(personBareName(n.title).split(/\s+/)[0], n);
  }
  // Links and code become blanks of the same length, so places stay places.
  const plain = src.split(PLAIN_SKIP_RE).map((p, i) => i % 2 ? " ".repeat(p.length) : p).join("");
  const out = [];
  for (const word of [...wants.keys()].sort((a, b) => b.length - a.length)) {
    const multi = /\s/.test(word);
    const re = new RegExp("(^|[^\\p{L}\\p{N}_/\\\\])(" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![\\p{L}\\p{N}_\\\\])", multi ? "giu" : "gu");
    const rows = wants.get(word);
    const named = rows.some(r => r.kind === "person" || r.kind === "org");
    const plainCap = !multi && word.slice(1) === word.slice(1).toLowerCase();
    let m;
    while ((m = re.exec(plain))) {
      const at = m.index + m[1].length, end = at + m[2].length;
      if (out.some(s => at < s.end && end > s.at)) continue;
      if (plainCap && !named && sentenceStart(plain.slice(0, at))) continue;
      out.push({at, end, rows});
    }
  }
  return out.sort((a, b) => a.at - b.at);
}
