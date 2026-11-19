/* The projects that name a day (#440): an ISO date in the project's title, or
   on a line that links the project. They are shown on that day's page, never
   written there, so every project with a date shows, the old ones too. */
function projectsOnDay(iso) {
  const by = memo("projectDays:" + V.space, () => {
    const m = new Map(), re = /\b(\d{4}-[01]\d-[0-3]\d)\b/g;
    const add = (text, p) => {
      for (const [, d] of String(text || "").matchAll(re)) { if (!m.has(d)) m.set(d, new Set()); m.get(d).add(p); }
    };
    for (const p of allPages(q => statusDirOf(q) && !isHorizonPage(q))) {
      add(pageTitle(p), p);
      for (const h of backlinksTo(p)) add(h.block.title, p);
    }
    return m;
  });
  return [...(by.get(iso) || [])];
}
