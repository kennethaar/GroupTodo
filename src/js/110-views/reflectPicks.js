/* The lines picked this week, by id: "toward" or "away". */
function reflectPicks() {
  const out = new Map();
  for (const k of reflectionBlock(false)?.block.children || []) {
    const m = PICK_RE.exec(k.title || "");
    if (m) out.set(m[2].toLowerCase(), m[1].toLowerCase());
  }
  return out;
}
