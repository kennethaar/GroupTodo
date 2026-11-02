/* A context is only ever the twin of another context, and may be one that is
   named on tasks without a page of its own: pc on c/Computer finds @pc. */
function aliasTwins(path, before) {
  const old = new Set(before.map(a => a.toLowerCase()));
  const fresh = pageAliases(path).map(a => a.toLowerCase()).filter(a => !old.has(a));
  if (!fresh.length) return [];
  if (isContextPath(path)) {
    const me = ctxNameOf(path).toLowerCase();
    return contextList().filter(c => c.toLowerCase() !== me && fresh.includes(c.toLowerCase())).map(contextPath);
  }
  return allPages(p => p !== path && !isJournalPath(p) && !isStencilPath(p) && !isHorizonPage(p) && !isContextPath(p) &&
    (fresh.includes(baseName(p).toLowerCase()) || fresh.includes(pageTitle(p).toLowerCase())));
}
