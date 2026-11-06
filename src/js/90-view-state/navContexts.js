function navContexts() {
  const acts = nextActions(), names = ctxFolderOrder(allContextNames()), open = navCtxOpen();
  const parents = new Set(names.filter(k => k.includes("/")).map(ctxTop).filter(t => names.includes(t)));
  const at = state.view === "next" ? state.ctxFilter : null;
  return names.filter(k => {
    const top = ctxTop(k);
    return k === top || !parents.has(top) || open.has(top) || k === at;
  }).map(k => {
    const top = ctxTop(k), here = at === k;
    const n = acts.filter(a => inContext(a, k)).length;
    const folds = k === top && parents.has(k), unfolded = folds && open.has(k);
    return el("button", {
      class: "nav-item small nav-sub" + (k !== top ? " deep" : "") + (here ? " active" : ""),
      "aria-current": here ? "page" : null, title: "What you can do at " + contextLabel(k),
      onclick: () => go("next", {sub: "list", ctxFilter: k}),
    },
      el("span", {class: "ic bw"}, contextIcon(k) || "@"),
      el("span", {class: "lbl"}, k === top ? k : k.slice(top.length + 1)),
      folds ? el("span", {class: "fold", role: "button", "aria-expanded": String(unfolded),
        title: unfolded ? "Fold away the contexts inside " + k : "Show the contexts inside " + k,
        onclick: e => { e.stopPropagation(); toggleNavCtx(k); }}, svgIcon(unfolded ? ICON_CARET : ICON_CHEVRON_RIGHT)) : null,
      n ? el("span", {class: "cnt"}, String(n)) : null);
  });
}
