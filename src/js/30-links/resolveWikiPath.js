/* target -> vault path (creating nothing) */
function resolveWikiPath(target) {
  target = trim(target).replace(/\.md$/i, "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(target) || WEEK_RE.test(target)) return journalPath(target);
  const m = /^([^/]+)\/(.+)$/.exec(target);
  if (m) {
    const [, pfx, rest] = m;
    if (STATUS_DIRS[pfx]) return join(STATUS_DIRS[pfx], rest + ".md");
    if (PREFIX_DIR[pfx])  return join(PREFIX_DIR[pfx], rest + ".md");
  }
  return join(PAGES, target + ".md");
}
