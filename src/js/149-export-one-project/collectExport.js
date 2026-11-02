/* ============================================================
   149_EXPORT_ONE_PROJECT
   Handing a single project to somebody, without handing them the space it
   lives in. The file is a copy, not a permission: once sent they have it
   for good. What it must never do is quietly carry more than you chose,
   so the dialog lists every page going out before it writes anything.
   ============================================================ */

/* Pages to include. Journals are never pulled in, even when referenced:
   a day's page is mixed content and would leak everything else in it. */
function collectExport(rootPath, {includeRefs = false} = {}) {
  const out = [rootPath];
  if (!includeRefs) return out;
  const page = getPage(rootPath);
  if (!page) return out;

  const texts = Object.values(page.props || {}).map(String);
  walkBlocks(page.blocks, b => {
    texts.push(b.title);
    (b.body || []).forEach(l => texts.push(l));
    for (const v of Object.values(b.props || {})) texts.push(String(v));
  });

  for (const text of texts) {
    for (const target of linksIn(text)) {
      const t = trim(target.split("][")[0]);
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) continue;          // a date link is a journal
      const p = findExistingPage(t);
      if (p && !isJournalPath(p) && !out.includes(p)) out.push(p);
    }
  }
  return out;
}
