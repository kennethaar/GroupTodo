/* On a day page a tracker is one of the page's values, at the top with the
   rest of them, not a line among the day's notes. A tracker line with nothing
   under it is moved up there; it keeps its values. So are the ones at the top
   of the page with only trackers above them, parents and siblings both --
   hours written under hours -- however deep. */
function hoistDayTrackers(page) {
  let moved = false;
  page.props = page.props || {};
  const lift = t => { if (!(t.key in page.props)) page.props[t.key] = t.raw; moved = true; };
  // The run of tracker lines the page opens with: true while it is unbroken.
  const leading = blocks => {
    while (blocks.length) {
      const b = blocks[0], t = !b.state && parseTracker(b.title);
      if (!t || !leading(b.children || [])) return false;
      blocks.shift(); lift(t);
    }
    return true;
  };
  leading(page.blocks = page.blocks || []);
  page.blocks = page.blocks.filter(b => {
    const t = !b.state && !(b.children || []).length && parseTracker(b.title);
    if (!t) return true;
    lift(t);
    return false;
  });
  return moved;
}
