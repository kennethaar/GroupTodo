/* The languages worth offering: the ones the vault has verbs in, plus the two
   we can seed, so an empty vault still shows both tabs. */
function verbLangs() {
  const have = new Set(Object.values(VERB_CANON).map(v => v.lang));
  for (const k of Object.keys(SEED_VERBS)) have.add(k);
  return Array.from(have).sort((a, b) => (a === "en" ? -1 : b === "en" ? 1 : a.localeCompare(b)));
}
