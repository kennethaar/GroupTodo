/* A pasted path, tidied of the quotes and bullets a chat window adds, and the
   space that actually has that file -- there may be more than one open. */
function pathHit(text) {
  let p = trim(String(text || ""))
    .replace(/^[-*>\s]+/, "")
    .replace(/^[`"'<(]+|[`"')>,.]+$/g, "")
    .replace(/\\/g, "/")
    .replace(/^\.?\//, "");
  if (!/\.(md|org)$/i.test(p) || /\s/.test(p)) return null;
  /* Exact first, then ignoring case: one of the two vaults may have been
     through Windows or a Mac on its way here, and a path that differs only in
     capitals is still the page they meant. */
  const find = () => {
    if (V.pages.has(p)) return [{path: p}];
    const low = p.toLowerCase();
    for (const key of V.pages.keys()) if (key.toLowerCase() === low) return [{path: key}];
    return [];
  };
  const hits = acrossSpaces(find);
  return (Array.isArray(hits) ? hits : [hits]).filter(Boolean)[0] || {path: p, missing: true};
}
