function applyRefocus() {
  const want = REFOCUS; REFOCUS = null;
  if (!want) return;
  requestAnimationFrame(() => {
    if ($("#modalRoot").firstChild) return;   // a picker opened on the way; it owns the keys
    const all = $$(want.selector);
    const node = all[want.nth] || all[0];     // the row may have left one list on the way
    if (node) node.focus({preventScroll: true});
  });
}
