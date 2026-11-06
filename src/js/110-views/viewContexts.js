/* ============================================================
   CONTEXTS -- where are you? See what you can do there.
   ============================================================ */
function viewContexts() {
  const c = el("div", {class: "wrap"});
  // One clear button: picking by hand is the context chip at the top (@ @).
  c.append(vhead("Contexts", "Where are you? See what you can do there.",
    el("button", {class: "btn ghost sense", title: "Guess from this device, its network and your places (g l)",
      onclick: () => senseNow()}, svgIcon(ICON_LOCATION), " Sense where I am"),
    newBtn("context", () => newContextPrompt()), viewSeg("contexts")));
  const acts = nextActions();
  const names = allContextNames();
  if (!names.length) {
    c.append(emptyCard(
      "No contexts yet. A context is what an action needs: a phone in your hand, a shop, two quiet hours. ",
      el("button", {class: "textbtn", onclick: () => openContextsWizard()}, "Set some up")));
    return c;
  }
  if (subNow() === "sort") { c.append(viewContextSort(acts)); return c; }
  // Actions with no context are a leak in the system, so they lead the page.
  const none = acts.filter(a => !a.context).length;
  if (none) c.append(el("div", {class: "ctxleak"},
    el("span", {}, svgIcon(ICON_WARN), " " + none + (none === 1 ? " action has" : " actions have") + " no context yet."),
    el("button", {class: "textbtn", onclick: () => go("next", {sub: "board"})}, "Give them one ›")));
  /* A context in a folder is a row on the card of the folder's top, so @home
     is read once and kitchen and garden sit under it. A context with nothing
     to do there is a pill under the cards, folded away until you open it. */
  const has = new Set(names);
  const busy = new Set(names.filter(n => acts.some(a => inContext(a, n))));
  const rootOf = n => {
    let r = n;
    for (let k = n; k.includes("/"); ) { k = k.slice(0, k.lastIndexOf("/")); if (has.has(k)) r = k; }
    return r;
  };
  const kidsOf = new Map();
  for (const n of ctxFolderOrder(names)) {
    const r = rootOf(n);
    if (r !== n && busy.has(n)) kidsOf.set(r, [...(kidsOf.get(r) || []), n]);
  }
  const roots = names.filter(n => rootOf(n) === n && (busy.has(n) || kidsOf.has(n)));
  const shown = new Set([...roots, ...[...kidsOf.values()].flat()]);
  const idle = names.filter(n => !shown.has(n));
  /* What a context's row says: how much, how much is late, and how fresh its
     chores are -- of each, how far from its next round, averaged. */
  /* A row keeps an empty cell where a fact is missing, so its columns line up
     with the rows above and below. */
  const facts = (n, row) => {
    const here = acts.filter(a => inContext(a, n));
    const late = here.filter(a => a.due && a.due < todayISO()).length;
    const rounds = here.map(freshnessOf).filter(Boolean);
    const fresh = freshScore(here);
    const gap = row ? el("span", {}) : null;
    return [
      el("span", {class: "ctxn"}, here.length ? here.length + " to do" : "none of its own"),
      late ? el("span", {class: "chip late"}, late + " late") : gap,
      fresh == null ? (row ? el("span", {}) : null) : el("span", {class: "fresh-score", style: "color:" + freshColor(fresh),
        title: rounds.length + " chore(s) here: 100% is all just done, 0% all due"}, fresh + "% fresh")];
  };
  if ([...busy].some(n => ctxHasKids(n))) c.append(fbar(ctxKidsChip()));
  if (roots.length) c.append(el("div", {class: "cardgrid ctxgrid"}, ...roots.map(n => {
    const icon = contextIcon(n), kids = kidsOf.get(n) || [];
    return el("div", {class: "cardbox ctxcard" + (kids.length ? " wide" : ""), role: "button", tabindex: "0", title: "Open " + contextPath(n),
      onclick: () => openContextPage(n),
      onkeydown: e => { if (e.key === "Enter" && e.target === e.currentTarget) { e.preventDefault(); openContextPage(n); } }},
      el("div", {class: "ctxhead"},
        el("h4", {}, icon ? el("span", {class: "ctxic", title: "From icon:: on the page"}, icon) : null, "@" + n),
        ...facts(n), el("span", {class: "ctxgo", "aria-hidden": "true"}, "›")),
      kids.length ? el("div", {class: "ctxkids"}, ...kids.map(k => el("button", {class: "ctxkid", title: "Open " + contextPath(k),
        style: "padding-left:" + ((k.split("/").length - n.split("/").length) * 14 - 10) + "px",
        onclick: e => { e.stopPropagation(); openContextPage(k); }},
        el("span", {class: "ctxkn"}, (contextIcon(k) ? contextIcon(k) + " " : "") + "/" + k.slice(n.length + 1)),
        ...facts(k, true)))) : null);
  })));
  if (idle.length) {
    const open = !roots.length || PREF.get("contexts.idle", "") === "1";
    const toggle = () => { PREF.set("contexts.idle", open ? "" : "1"); render(); };
    c.append(el("div", {class: "ctxidle"},
      roots.length ? el("button", {class: "textbtn ctxfold", "aria-expanded": String(open), onclick: toggle},
        svgIcon(open ? ICON_CARET : ICON_CHEVRON_RIGHT), " Nothing to do (" + idle.length + ")") : null,
      open ? el("div", {class: "ctxpills"}, ...idle.map(n => el("button", {class: "fchip", title: "Open " + contextPath(n),
        onclick: () => openContextPage(n)}, (contextIcon(n) ? contextIcon(n) + " " : "") + "@" + n))) : null));
  }
  c.append(el("p", {class: "hint"}, "Each context is a page under c/. Write icon:: on it to give it an icon."));
  return c;
}
