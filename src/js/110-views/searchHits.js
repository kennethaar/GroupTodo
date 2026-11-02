/* Everything the vault has that matches, with enough on each hit to filter it
   afterwards without walking the pages a second time. Best first. */
function searchHits(q) {
  const phrase = String(q).toLowerCase();
  // Nothing but symbols -- "::", "#" -- has no words to rank; match it as typed.
  const terms = searchWords(q);
  if (!terms.length) return acrossSpaces(() => {
    const found = [];
    for (const [path, page] of V.pages) walkBlocks(page.blocks, b => {
      if ([b.title, ...(b.body || [])].join(" ").toLowerCase().includes(phrase))
        found.push({path, block: b, kind: pageKind(path), todo: !!b.state, archived: isArchived(path), score: 1});
    });
    return found;
  }).sort((a, b) => a.archived - b.archived);
  const hits = acrossSpaces(() => {
    const found = [];
    for (const [path, page] of V.pages) {
      const kind = pageKind(path);
      const archived = isArchived(path);
      const named = searchScore(terms, phrase, pageTitle(path));
      if (named) found.push({path, block: null, kind, archived, score: named * 2});
      walkBlocks(page.blocks, b => {
        const s = searchScore(terms, phrase, [b.title, ...(b.body || [])].join(" "));
        if (s) found.push({path, block: b, kind, todo: !!b.state, archived,
                           score: s + (OPEN_STATES[b.state] ? 1 : 0)});
      });
    }
    return found;
  });
  return hits.sort((a, b) => (a.archived - b.archived) || (b.score - a.score));
}
