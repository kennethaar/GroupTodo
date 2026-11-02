function navGo(delta) {
  if (NAV_JUMPING) return;
  const active=document.activeElement;
  if (active && active.isContentEditable) active.blur();
  const to = NAV_AT + delta;
  if (to < 0 || to >= NAV_HIST.length) { notify(delta < 0 ? "Nowhere further back." : "Nowhere further forward."); return; }
  NAV_AT = to;
  navApply(NAV_HIST[to]);
}
