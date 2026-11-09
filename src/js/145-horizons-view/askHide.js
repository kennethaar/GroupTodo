/* text with its names swapped for tokens, and the map from each token back
   to its name. recipient is [P1]. A first name stands for its person only
   where nobody else known goes by it. Longer names go first, so "Lars
   Haugen" is one person and not Lars and a stray Haugen. */
function askHide(text, recipient = "") {
  const map = new Map(), tokenOf = new Map(), count = {P: 0, O: 0, E: 0, T: 0};
  const token = (kind, real) => {
    const k = kind + real.toLowerCase();
    if (!tokenOf.has(k)) { const t = "[" + kind + (++count[kind]) + "]"; tokenOf.set(k, t); map.set(t, real); }
    return tokenOf.get(k);
  };
  if (trim(recipient)) token("P", trim(recipient));
  let out = String(text || "")
    .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, m => token("E", m))
    .replace(/\+\d[\d -]{6,}\d|(?<![\d-])\d{2,3}(?: \d{2,3}){2,4}(?![\d-])/g, m => token("T", m));

  const terms = [];   // {words, kind, real}
  const people = [], orgs = new Set();
  for (const r of personOrgIndex().values()) {
    people.push(r.name);
    if (r.bare !== r.name) people.push(r.bare);
    for (const o of r.orgs) if (!isCircleOrg(o)) orgs.add(o);
  }
  eachVisibleSpace(() => { for (const p of allPages(q => pageKind(q) === "org")) orgs.add(baseName(p)); });
  const full = [...new Set([trim(recipient), whoAmI() || "", ...people].filter(Boolean))];
  for (const n of full) terms.push({words: n, kind: "P", real: n});
  // A first name, where it is one person's alone.
  const firsts = new Map();
  for (const n of full) {
    const f = personBareName(n).split(/\s+/)[0];
    if (f.length < 3 || f === personBareName(n)) continue;
    const k = f.toLowerCase();
    // null once two people share it, and it stays null for a third (#345).
    const had = firsts.get(k);
    firsts.set(k, firsts.has(k) && (!had || !samePerson(had.real, n)) ? null : {words: f, kind: "P", real: n});
  }
  // The person asked keeps their first name whoever else shares it.
  const rf = trim(recipient).split(/\s+/)[0];
  if (rf && rf !== trim(recipient)) firsts.set(rf.toLowerCase(), {words: rf, kind: "P", real: trim(recipient)});
  for (const f of firsts.values()) if (f) terms.push(f);
  for (const o of [...orgs, ...askHideNames()]) terms.push({words: o, kind: "O", real: o});

  terms.sort((a, b) => b.words.length - a.words.length);
  for (const {words, kind, real} of terms)
    out = out.replace(new RegExp("(?<![\p{L}\p{N}@.])" + askEsc(words) + "(?![\p{L}\p{N}])", "giu"), () => token(kind, real));
  return {text: out, map};
}
