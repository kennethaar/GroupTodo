/* Where the choices so far leave an area's someday projects: the places
   settled, best first, and the next pair to ask about, if any. The next place
   goes to the one project that nothing still in play has beaten. While two or
   more are unbeaten, the two with fewest wins play, as in a cup -- the one
   with most wins taking on each newcomer in turn makes the best beat half the
   deck itself, and all of those then have to play for second. When
   every one left has lost to another one left (a beat b, b beat c, c beat a)
   most wins takes the place, without asking round the circle again. */
function sdStanding(space) {
  const items = sdProjects().filter(r => (r.space || "") === space);
  const slugs = new Set(items.map(sdSlug));
  const lostTo = new Map(), wins = new Map();
  for (const x of sdResults(space)) {
    if (!sdFresh(x) || !slugs.has(x.w) || !slugs.has(x.l)) continue;
    (lostTo.get(x.l) || lostTo.set(x.l, new Set()).get(x.l)).add(x.w);
    wins.set(x.w, (wins.get(x.w) || 0) + 1);
  }
  const played = [...lostTo.values()].reduce((n, s) => n + s.size, 0);
  const winsOf = r => wins.get(sdSlug(r)) || 0;
  const byWins = (a, b) => winsOf(b) - winsOf(a) || (solIdle(a) ?? 1e6) - (solIdle(b) ?? 1e6);
  const ranked = [], target = Math.min(SD_TOP, items.length);
  let pair = null, open = [];
  while (ranked.length < target) {
    const left = items.filter(r => !ranked.includes(r));
    const inPlay = new Set(left.map(sdSlug));
    const losses = r => [...(lostTo.get(sdSlug(r)) || [])].filter(s => inPlay.has(s)).length;
    const least = Math.min(...left.map(losses));
    const top = left.filter(r => losses(r) === least).sort(byWins);
    if (top.length === 1 || least > 0) { ranked.push(top[0]); continue; }
    open = top;
    top.sort((a, b) => winsOf(a) - winsOf(b));
    for (let i = 0; i < top.length && !pair; i++)
      for (let j = i + 1; j < top.length && !pair; j++)
        if (!SD.skipped.has(sdPairKey(sdSlug(top[i]), sdSlug(top[j])))) pair = [top[i], top[j]];
    break;
  }
  return {items, ranked, rest: items.filter(r => !ranked.includes(r)).sort(byWins), pair, open, target, played};
}
