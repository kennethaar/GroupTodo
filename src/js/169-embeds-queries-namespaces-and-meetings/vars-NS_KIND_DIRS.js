/* ---------- the family a page belongs to ----------
   A namespace is a page name with parts: in folders (pages/Work/Clients.md,
   linked as [[Work/Clients]]) or, the way the importer flattens Logseq's,
   in the name itself (Work - Clients). The kind folders (1/, p/, c/ ...) say
   what a page is, not which family, so they are not a part -- but a project
   kept in a folder of its own (1/Party/Invites) still has one. People are
   never split on " - ", since "Anna Berg - Acme" names where Anna works. */
const NS_KIND_DIRS = () => new Set([...Object.values(DIRS), join(PAGES, "_")].filter(d => d !== PAGES && d !== JOURNALS));
