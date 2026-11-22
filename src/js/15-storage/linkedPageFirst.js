/* The page a link opened the app at (#gt&p=...), read by name with today's:
   on a phone a link tapped elsewhere starts a new tab, and the link is
   followed long before a big folder is listed (#474). Only a page of this
   area, and only a page. */
function linkedPageFirst(record) {
  const link = parseDeepLink(location.hash);
  if (!link || (link.space && link.space !== record.name)) return [];
  const p = link.path;
  return /\.md$/i.test(p) && !p.split("/").includes("..") ? [p] : [];
}
