function trackerText(t, values) {
  const v = values.map(x => trim(String(x == null ? "" : x)));
  while (v.length && !v[v.length - 1]) v.pop();
  return trim(t.key + ":: " + v.join("/"));
}
