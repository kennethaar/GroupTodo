/* The files in assets/ a line links to, in its words and the lines written
   under it, each once (#391). */
function assetPathsOf(b) {
  const out = [];
  for (const text of [b && b.title, ...((b && b.body) || [])]) {
    for (const m of String(text || "").matchAll(/!?\[[^\]]*\]\((assets\/[^)\s]+)\)/gi))
      if (!out.includes(m[1])) out.push(m[1]);
  }
  return out;
}
