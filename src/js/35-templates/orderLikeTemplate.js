/* A page's values stand in its template's order, so moving a key in the
   template moves it on every page made from it. Keys the template does not
   have keep their own order, after the template's. */
function orderLikeTemplate(props, tplProps) {
  const rank = new Map();
  Object.keys(tplProps).forEach(k => { if (!/^(template_|feature_)/i.test(k)) rank.set(k.toLowerCase(), rank.size); });
  const keys = Object.keys(props);
  const ordered = keys.map((k, i) => [k, rank.has(k.toLowerCase()) ? rank.get(k.toLowerCase()) : rank.size + i])
    .sort((a, b) => a[1] - b[1]).map(([k]) => k);
  if (ordered.every((k, i) => k === keys[i])) return false;
  const values = ordered.map(k => props[k]);
  for (const k of keys) delete props[k];
  ordered.forEach((k, i) => { props[k] = values[i]; });
  return true;
}
