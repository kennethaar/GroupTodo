/* Continue (#492): the place you left off, in its area, at its line; Back
   comes back to the Journal. */
function lastPlaceGo() {
  const o = LAST_PLACE_OFFER;
  if (!o || o === true) return;
  LAST_PLACE_OFFER = null;
  navRecord();                        // the Journal, for Back
  const land = () => {
    for (const k of NAV_FIELDS) state[k] = o.place[k] ?? null;
    render();
    navRecord();
    if (!o.line) return;
    requestAnimationFrame(() => {
      const t = $(`#content .blk[data-id="${CSS.escape(String(o.line))}"] .txt`);
      if (!t) return;
      t.focus({preventScroll: true});
      t.scrollIntoView({block: "center"});
    });
  };
  if (o.space && Spaces.active && o.space !== Spaces.active && Spaces.get(o.space)) openSpace(o.space, o.place).then(land, land);
  else land();
}
