/* The markdown for a run of blocks, children and all. Pulled out of
   serializePage because it is also what a handful of lines copied to the
   clipboard has to be: the same text the file holds, so what is pasted back --
   here, or into any other outliner -- is what was taken. */
function serializeBlockLines(blocks, level = 0) {
  const out = [];
  for (const b of blocks || []) {
    const pad = "  ".repeat(level);
    out.push((pad + "- " + (b.state ? b.state + " " : "") + dropSameLabels(b.title)).replace(/\s+$/, ""));
    // A table's fields go after its rows, so the file's Markdown table stays whole (#469).
    const body = b.body || [], rows = Object.keys(b.props || {}).length ? tableRows(b) : 0;
    const line = l => out.push(l === "" ? "" : pad + "  " + l);
    body.slice(0, rows).forEach(line);
    for (const [k, v] of Object.entries(b.props || {})) out.push(pad + "  " + k + ":: " + dropSameLabels(v));
    body.slice(rows).forEach(line);
    for (const d of b.drawers || []) for (const l of d) out.push(l === "" ? "" : pad + "  " + l);
    if (b.children && b.children.length) out.push(...serializeBlockLines(b.children, level + 1));
  }
  return out;
}
