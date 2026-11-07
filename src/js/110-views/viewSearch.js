function viewSearch() {
  const c = el("div", {class: "wrap"});
  c.append(vhead("Search", "Tasks and pages, in every area you are showing"));
  const run = () => {
    const draft = trim(state.searchDraft);
    /* A path is an address, not a phrase: somebody has pasted what another
       person's "copy path" gave them, and they mean open it. pathHit decides
       -- anything that is not path-shaped comes back null and is searched. */
    const hit = pathHit(draft);
    if (hit && !hit.missing) { openPageIn(hit.space, hit.path); return; }
    if (hit) notify("No page at " + hit.path + " in any area open here. " +
                    "Searching for it as words instead.", "warn");
    state.query = draft;
    render();
  };
  const input = el("input", {
    placeholder: "Search every block and page, then press Enter...",
    value: state.searchDraft,
    oninput: e => { state.searchDraft = e.target.value; },
    onkeydown: e => {
      if (e.key === "Enter") { e.preventDefault(); run(); }
      else if (e.key === "Escape") { e.target.blur(); }
    },
  });
  c.append(el("div", {class: "filterbox", style: "padding:14px 0"}, input,
    el("button", {class: "btn sm primary", onclick: run}, "Search")));
  /* The box keeps the keys. Pressing Enter rebuilds the screen, and a search
     box you have to click back into before you can correct a word is a box
     that has thrown your place away. */
  requestAnimationFrame(() => {
    if ($("#modalRoot").firstChild) return;
    input.focus();
    const n = input.value.length;
    try { input.setSelectionRange(n, n); } catch (_) {}
  });

  // The filter is a choice about the results, so changing it re-reads the
  // search you already ran rather than asking you to run it again.
  c.append(fbar(...SEARCH_FILTERS.map(([id, label]) =>
    fchip(label, state.searchFilter === id, () => { state.searchFilter = id; render(); }))));

  const q = trim(state.query).toLowerCase();
  if (!q) {
    c.append(el("div", {class: "empty"},
      "Type what you are looking for and press Enter. Every word has to be there, in any " +
      "order; the start of a word is enough, and a small typo is forgiven."));
    return c;
  }
  const keep = SEARCH_KEEP[state.searchFilter] || SEARCH_KEEP.all;
  const hits = searchHits(q).filter(keep);
  const card = el("div", {class: "card"});
  if (!hits.length) {
    card.append(el("div", {class: "empty"}, state.searchFilter === "all"
      ? "No matches."
      : "No matches among " + (state.searchFilter === "todos" ? "todos" : "projects") +
        ". Try Everything."));
  }
  for (const h of hits.slice(0, 300)) {
    const label = inSpace(h.space, () => h.block ? h.block.title : pageTitle(h.path));
    // A page hit is already named by its title; a line says which page it is on.
    const where = h.block || /^journals\//i.test(h.path) ? inSpace(h.space, () => placeName(h.path)) : null;
    card.append(el("button", {class: "dash-item",
      onclick: () => h.block ? inSpace(h.space, () => openTaskDetail(h.path, h.block, h.space))
                             : openPageIn(h.space, h.path)},
      h.block ? stateChip(h.block.state, h.block) : null,
      // The context leads, as in the Journal and Next (#315).
      h.block && contextOf(h.block.title) ? el("span", {class: "chip ctx"}, "@" + contextOf(h.block.title)) : null,
      el("span", {translate: "no", html: renderInline(label)}),
      multiSpace() && h.space ? spaceBadge(h.space) : null,
      h.archived ? el("span", {class: "chip"}, "archived") : null,
      where ? el("span", {class: "p where"}, where) : null));
  }
  c.append(section("Results", hits.length, card));
  return c;
}
