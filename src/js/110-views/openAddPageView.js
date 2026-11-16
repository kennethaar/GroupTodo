/* + on a page's tabs, and Add a view in its ⋯ (#420): the views that can work
   here, those shown marked. Picking one adds its tab, or takes it off. */
function openAddPageView(path) {
  const on = pageViews(path);
  const rows = PAGE_VIEWS.filter(v => on.includes(v.id) || v.works(path)).map(v => {
    const shown = on.includes(v.id);
    return [v.label + (shown ? " ✓" : ""), shown ? "shown; pick to take it off" : v.what, () => {
      if (shown) { setPageViews(path, on.filter(id => id !== v.id)); return; }
      setPageViews(path, [...on, v.id]);
    }];
  });
  chipMenu("Views of " + pageTitle(path), null, lettered(rows));
}
