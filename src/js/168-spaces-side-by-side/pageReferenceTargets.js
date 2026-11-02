/* Every page this one points at, by link or by #tag, resolved the way the
   app resolves any link. */
function pageReferenceTargets(page) {
  const text = serializePage(page), refs = linksIn(text);
  for (const m of text.matchAll(/(?:^|[\s(])#([^\s#\[\](),;]+)/gu)) refs.push(m[1]);
  const out = new Set();
  for (const ref of refs) {
    const p = findExistingPage(ref);
    if (p) out.add(p);
  }
  return out;
}
