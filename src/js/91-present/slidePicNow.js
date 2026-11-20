/* The picture a slide shows at its k-th part (#464): the lit part's own
   picture; else the slide's; else the last one shown, so nothing jumps;
   before any, the first one to come. */
function slidePicNow(s, k) {
  const pics = s.pics || [];
  if (k > 0 && pics[k - 1]) return pics[k - 1];
  if (s.cover) return s.cover;
  for (let i = k - 2; i >= 0; i--) if (pics[i]) return pics[i];
  return pics.find(Boolean) || "";
}
