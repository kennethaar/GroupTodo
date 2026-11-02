// Why two names look alike, or null when they do not.
function twinWhy(a, b) {
  const wa = twinWords(a), wb = twinWords(b);
  if (!wa.length || !wb.length) return null;
  // Fase 1 and Fase 2, Q3 and Q4: a different number is a different project.
  const nums = w => w.map(x => (x.match(/\d+/g) || []).join(",")).filter(Boolean).sort().join(" ");
  if (nums(wa) !== nums(wb)) return null;
  const ka = [...wa].sort().join(" "), kb = [...wb].sort().join(" ");
  if (ka === kb) return wa.join(" ") === wb.join(" ") ? "the same name" : "the same words in another order";
  // Words matched one to one; a typo (4+ letters, 80% alike) still a match.
  const left = [...wb];
  let hit = 0;
  for (const w of wa) {
    const i = left.findIndex(x => x === w || (w.length >= 4 && x.length >= 4 && editRatio(w, x) >= 0.8));
    if (i >= 0) { hit++; left.splice(i, 1); }
  }
  const most = Math.max(wa.length, wb.length);
  if (most >= 2 && hit / most >= 0.75) return "nearly the same words";
  const na = twinNorm(a), nb = twinNorm(b);
  if (Math.min(na.length, nb.length) >= 6 && editRatio(na, nb) >= 0.85) return "nearly the same name";
  return null;
}
