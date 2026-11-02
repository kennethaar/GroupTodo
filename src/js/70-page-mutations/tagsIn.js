/* The #tags on a line, each once, spelled the way they were first written.
   Links are taken out first, so a #word inside a link's label is not a tag --
   the same reading renderInline and backlinksTo give it. */
function tagsIn(title) {
  const plain = String(title || "").replace(/\[\[[\s\S]*?\]\]/g, " ");
  const out = [];
  for (const m of plain.matchAll(/(^|\s)#([\p{L}\p{N}_\-/]+)/gu))
    if (!out.some(t => t.toLowerCase() === m[2].toLowerCase())) out.push(m[2]);
  return out;
}
