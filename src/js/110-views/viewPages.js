function viewPages() {
  const sub = subNow();
  const c = el("div", {class: "wrap" + (sub === "list" ? "" : " wide")});
  c.append(vhead("Pages", multiSpace() ? "Everything in the areas you are showing" : "Everything in " + (Spaces.active || "this area"),
    newBtn("note", () => newZettelPrompt()), newBtn("recipe", () => openRecipeWithAI()), viewSeg("pages")));
  if (sub === "mindmap") { c.append(viewPlex()); return c; }
  if (sub === "graph") { c.append(viewGraphMap()); return c; }
  if (sub === "tree") { c.append(viewRelationshipBoard()); return c; }
  if (sub === "board") { c.append(viewKindBoard()); return c; }

  /* One folder at a time. Journals are a folder of their own, kept out of
     "All pages" so a year of day pages does not bury everything else. */
  const all = pageRowsVisible();
  const counts = {};
  for (const r of all) counts[r.kind] = (counts[r.kind] || 0) + 1;
  const kind = counts[PREF.get("pages.kind", "")] ? PREF.get("pages.kind", "") : "";
  const sort = PREF.get("pages.sort", "edited");
  const setKind = v => { PREF.set("pages.kind", v); render(); };
  const folders = Object.keys(PAGE_KINDS).filter(k => k !== "journal" && counts[k]);
  const rows = all.filter(r => kind ? r.kind === kind : r.kind !== "journal");
  rows.sort(sort === "az" ? (a, b) => a.title.localeCompare(b.title)
    : sort === "linked" ? (a, b) => b.links - a.links || a.title.localeCompare(b.title)
    : (a, b) => String(b.edited).localeCompare(String(a.edited)) || a.title.localeCompare(b.title));
  const f = textFilter("pages", "Filter " + (kind ? PAGE_KINDS[kind] : "all pages").toLowerCase(), rows,
    r => [r.title, r.path, ...inSpace(r.space, () => pageAliases(r.path))].join(" "), (hits, q) => pagedCard(hits, pageRow, noMatch(q, "Nothing here yet.")));
  const sortSel = fselect("Sort", sort, [["edited", kind === "journal" ? "Newest first" : "Recently edited"], ["linked", "Most linked"], ["az", "A to Z"]],
    v => { PREF.set("pages.sort", v); render(); });
  sortSel.classList.add("right");
  c.append(fbar(f.input,
    fchip("All pages", !kind, () => setKind(""), all.length - (counts.journal || 0)),
    ...folders.map(k => fchip(PAGE_KINDS[k], kind === k, () => setKind(k), counts[k])),
    counts.journal ? el("span", {class: "gap"}) : null,
    counts.journal ? fchip(PAGE_KINDS.journal, kind === "journal", () => setKind("journal"), counts.journal) : null,
    sortSel), f.host);
  return c;
}
