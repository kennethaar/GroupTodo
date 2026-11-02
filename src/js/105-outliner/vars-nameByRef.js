/* The name behind a link, by its ref: "p/John Smith" -> its row in nameIndex. */
const nameByRef = ref => memo("nameByRef", () =>
  new Map(nameIndex().map(n => [n.ref.toLowerCase(), n]))).get(trim(String(ref || "")).toLowerCase());
const isAliasOf = (ref, label) => !!label &&
  (nameByRef(ref)?.aliases || pageAliasesByRef(ref)).some(a => a.toLowerCase() === trim(label).toLowerCase());
/* Any page's aliases by its ref, for the pages nameIndex does not list:
   a note, a routine, a goal. */
const pageAliasesByRef = ref => memo("pageAliasesByRef", () => {
  const m = new Map();
  acrossSpaces(() => {
    for (const p of allPages(q => { const pr = getPage(q)?.props; return !!(pr && (pr.aliases || pr.alias)); }))
      if (!m.has(pageRef(p).toLowerCase())) m.set(pageRef(p).toLowerCase(), pageAliases(p));
    return [];
  });
  return m;
}).get(trim(String(ref || "")).toLowerCase()) || [];
/* A context written by one of its aliases is that context: aliases:: pc on
   c/Computer makes @pc the Computer context, never a new one called pc. */
const contextByAlias = name => memo("contextByAlias", () => {
  const m = new Map();
  for (const n of nameIndex()) if (n.kind === "context")
    for (const a of n.aliases) if (!m.has(a.toLowerCase())) m.set(a.toLowerCase(), n.title);
  return m;
}).get(trim(String(name || "")).replace(/^@/, "").toLowerCase()) || null;
