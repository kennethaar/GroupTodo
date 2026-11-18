/* A slide's lines cut into slides of at most max lines (#433), in order, so
   a long timeline goes on as "Plan (2/2)" and no line is ever dropped. */
function slidePages(kids, max) {
  if (!(kids.length > max)) return [kids];
  const pages = [];
  for (let i = 0; i < kids.length; i += max) pages.push(kids.slice(i, i + max));
  return pages;
}
