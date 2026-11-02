/* A link you type is a page you meant. Writing
   "Chase the quote [[1/Userflow]] [[p/Niclas]] [[c/computer]]" is how a
   project, a person and a context get started here, so the pages behind a line
   are made as the line is written -- rather than left as broken links for the
   health check to find weeks later. Dates and [[go/...]] doors are not pages,
   and anything already there is left exactly as it is. */
function createLinkedPages(text) {
  text=String(text).replace(/\[\[([^\]]+)#[^\]]+\]\]/g,"[[$1]]");
  const made = [];
  for (const raw of linksIn(text)) {
    const target = trim(String(raw).split("][")[0]);
    if (!target || /^go\//i.test(target)) continue;
    if (/^\d{4}-\d{2}-\d{2}$/.test(target)) continue;
    const m = /^([^/]+)\/(.+)$/.exec(target);
    if (!m || !LINK_PREFIXES.has(m[1])) continue;   // a bare [[note]] is not filed anywhere
    if (findExistingPage(target)) continue;
    const path = resolveWikiPath(target);
    putPage(path, pageTemplateFor(m[1], trim(m[2])));
    if (m[1] === "c") syncCtxChildren(ctxParentPath(path));
    made.push(path);
  }
  if (!made.length) return made;
  scanVerbs();
  const name = p => (statusDirOf(p) ? "project " : "") + pageTitle(p);
  notify(made.length === 1
    ? "Started " + name(made[0])
    : "Started " + made.length + " pages: " + made.map(pageTitle).join(", "));
  return made;
}
