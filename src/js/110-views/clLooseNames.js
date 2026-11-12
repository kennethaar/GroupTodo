/* People, organisations and projects a line names without a link (#379):
   [{kind, words, ref}], the words as they stand on the line. Longest name first,
   so "Ola Hansen" is found before "Ola". A context is left out: "phone" or
   "home" in a sentence is seldom meant as one. */
function clLooseNames(title) {
  let plain = String(title || "").replace(/\[\[[\s\S]*?\]\]/g, " ");
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const names = namesHere().filter(n => ["person", "org", "project"].includes(n.kind) && trim(n.title).length >= 3)
    .sort((a, b) => b.title.length - a.title.length);
  const out = [];
  for (const n of names) {
    const m = new RegExp("(^|[^\\p{L}\\p{N}])(" + esc(trim(n.title)) + ")(?=$|[^\\p{L}\\p{N}])", "iu").exec(plain);
    if (!m) continue;
    out.push({kind: n.kind, words: m[2], ref: n.ref});
    const at = m.index + m[1].length;
    plain = plain.slice(0, at) + " ".repeat(m[2].length) + plain.slice(at + m[2].length);
  }
  return out;
}
