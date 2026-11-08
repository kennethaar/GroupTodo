/* The lines picked this week, by id: {way: "toward" or "away", aim: the
   intention's id, or "" for a pick made before intentions were linked}. */
function reflectPicks() {
  const out = new Map();
  for (const k of reflectionBlock(false)?.block.children || []) {
    const m = PICK_RE.exec(k.title || "");
    if (m) out.set(m[2].toLowerCase(), {way: m[1].toLowerCase(), aim: (m[3] || "").toLowerCase()});
  }
  return out;
}
