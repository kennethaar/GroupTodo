/* People and organisations already here that the text names, by name or by
   one of their aliases, so the AI spells them the way their pages do. */
function planKnownNames(text) {
  const lower = String(text || "").toLocaleLowerCase(), out = [];
  const named = (path, name) => [name, ...String(getPage(path)?.props?.aliases || "").split(",")]
    .map(trim).some(n => n.length > 2 && new RegExp("(^|[^\\p{L}])" + planReEsc(n.toLocaleLowerCase()) + "(?![\\p{L}])", "u").test(lower));
  for (const p of allPeople()) {
    const n = personName(p);
    if (!samePerson(n, whoAmI()) && (named(p, n) || (personBareName(n).includes(" ") && named(p, personBareName(n)))))
      out.push("[[p/" + n + "]]");
  }
  for (const o of allPages(q => pageKind(q) === "org")) if (named(o, baseName(o))) out.push("[[o/" + baseName(o) + "]]");
  return out;
}
