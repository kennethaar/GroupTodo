/* A slide's lines cut into slides of at most max lines (#433), in order, so
   a long timeline goes on as "Plan (2/2)" and no line is ever dropped. The
   slides share the lines evenly, the larger first: 10 is 5 and 5, not 9 and 1. */
function slidePages(kids, max) {
  if (!(kids.length > max)) return [kids];
  const n = Math.ceil(kids.length / max), small = Math.floor(kids.length / n), big = kids.length % n;
  const pages = [];
  for (let p = 0, i = 0; p < n; p++) {
    const size = small + (p < big ? 1 : 0);
    pages.push(kids.slice(i, i + size));
    i += size;
  }
  return pages;
}
