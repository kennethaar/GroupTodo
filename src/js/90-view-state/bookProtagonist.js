/* The main character: protagonist:: on the book's page, or whoever sees the most
   scenes, or else is in the most. */
function bookProtagonist() {
  const {scenes, cast, isChar} = bookAnalysis();
  const said = castEntryOf(namesIn(bookProps().protagonist || "")[0] || "");
  if (said && isChar.has(said.key)) return said.key;
  const score = new Map();
  for (const sc of scenes) {
    if (sc.pov) score.set(sc.pov, (score.get(sc.pov) || 0) + 1000);
    for (const k of sc.present) if (isChar.has(k)) score.set(k, (score.get(k) || 0) + 1);
  }
  const best = [...score].sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : (cast.find(e => isChar.has(e.key)) || {}).key || null;
}
