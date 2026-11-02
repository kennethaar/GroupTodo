/* The responsibilities for a name: a new one of that name first unless it is
   already there, then the same name, the look-alikes, and the rest. */
function rankedAreas(title) {
  const ranked = areaList().map(p => ({path: p, label: pageTitle(p), score: areaLikeness(title, pageTitle(p))}))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  const own = join(DIRS.areas, slugify(title) + ".md");
  const same = ranked.find(r => r.score === 3 || r.path === own) || null;
  const items = (same || !trim(title) ? [] : [{path: null, label: title, score: -1}]).concat(ranked);
  return {items, same};
}
