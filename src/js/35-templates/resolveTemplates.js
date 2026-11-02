/* Every template that applies, most specific first. */
function resolveTemplates({date, kind}) {
  const cands = templateCandidates(date, kind);
  if (kind === "journals" || (date && !kind)) cands.push("journals");
  if (kind && kind !== "journals") cands.push(kind);
  const out = [], seen = new Set();
  for (const name of cands) {
    const p = readTemplate(name);
    if (p && !seen.has(p)) { seen.add(p); out.push({path: p, name}); }
  }
  return out;
}
