/* Verbs belong to every area, so a word taught while one area was open still
   counts when another opens first. The open area's own pages win a tie. */
function scanVerbs() {
  VERB_LOOKUP = {}; VERB_CANON = {};
  const others = [...LOADED.values()].filter(r => r.pages !== V.pages)
    .map(r => [r.name, [...r.pages.keys()].filter(p => p.startsWith(DIRS.verbs + "/") && !V.pages.has(p))]);
  for (const [name, paths] of others) inSpace(name, () => paths.forEach(scanVerbPage));
  for (const path of V.pages.keys()) scanVerbPage(path);
}
