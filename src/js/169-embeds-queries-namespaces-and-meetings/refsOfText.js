function refsOfText(text) {
  const out = new Set(), s = String(text || "");
  for (const l of linksIn(s)) out.add(queryRefKey(l));
  for (const t of tagsIn(s)) out.add(queryRefKey(t));
  return out;
}
