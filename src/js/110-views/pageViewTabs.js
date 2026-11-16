/* The tabs over a page that has views (#420): Outline first, then its views,
   then + for another. Nothing until a view is added. */
function pageViewTabs(path) {
  const ids = pageViews(path);
  if (!ids.length) return null;
  const cur = pageViewNow(path);
  const tab = (id, label) => el("button", {"aria-pressed": String(cur === id),
    onclick: () => { PREF.set(pageViewKey(path), id); render(); }}, label);
  return el("div", {class: "vseg pviews", role: "group", "aria-label": "View as"},
    tab("outline", "Outline"), ...ids.map(id => tab(id, PAGE_VIEWS.find(v => v.id === id).label)),
    el("button", {class: "pvadd", title: "Another view, or take one off", "aria-label": "Views", onclick: () => openAddPageView(path)}, "+"));
}
