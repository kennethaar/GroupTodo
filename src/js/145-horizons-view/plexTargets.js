/* Where everything wants to be. Returns key -> {x,y,r,a,ring}; anything absent
   is off the plex and is not drawn. */
function plexTargets(g, key, w, h) {
  const out = new Map();
  const {i, parents, children, jumps} = plexRelatives(g, key);
  if (i < 0) return out;
  const cx = w / 2;
  /* The middle is only in the middle when there is something on both sides of
     it. A page nothing points at, fanning ten tasks downward, should not leave
     the top half of the box empty and crowd everything into the bottom. */
  const lean = (parents.length ? 1 : 0) - (children.length ? 1 : 0);
  const cy = h / 2 + lean * h * 0.13;
  const R = Math.min(w, h) * 0.3;

  out.set(g.nodes[i].key, {x: cx, y: cy, r: 13, a: 1, ring: 0, idx: i, rank: 0});

  /* An arc rather than a ring: parents overhead, children underfoot, jumps on
     the horizon. A fan keeps them apart without a simulation.

     Past about six on one side, one arc at one distance puts the dots -- and,
     long before the dots, their names -- on top of each other. So a long side
     is dealt out into two arcs at different distances, taking every other item
     so neighbours in the list never share a row. `label` says which way the
     name hangs off the dot, which is the other half of not overlapping:
     overhead for the parents, underfoot for the children. */
  const fan = (list, centreAngle, spread, radius, r, a, ring, label, rank) => {
    const rows = list.length > 6
      ? [list.filter((_, k) => k % 2 === 0), list.filter((_, k) => k % 2 === 1)]
      : [list];
    rows.forEach((row, ri) => {
      // Capped, so the outer arc stays inside the box with room for its names.
      const rad = Math.min(radius * (ri ? 1.52 : 1), Math.min(w, h) * 0.41);
      const n = row.length;
      row.forEach((idx, k) => {
        const t = n === 1 ? 0 : (k / (n - 1)) - 0.5;
        const ang = centreAngle + t * Math.min(spread, 0.5 * n);
        out.set(g.nodes[idx].key, {
          x: cx + Math.cos(ang) * rad,
          y: cy + Math.sin(ang) * rad,
          r: ri ? r * 0.88 : r, a, ring, idx, label, rank,
        });
      });
    });
  };
  const UP = -Math.PI / 2, DOWN = Math.PI / 2;
  /* rank is who gets the space when two names want it: what this is made of
     before what merely sits beside it, and both before the outer ring. */
  fan(parents,  UP,   2.0, R, 9, 1, 1, "above", 1);
  fan(children, DOWN, 2.0, R, 9, 1, 1, "below", 1);
  /* The jumps sit out to the sides, where there is room along the x axis but
     none along the y, so their names go beside them rather than underneath. */
  const side = jumps.slice(0, 8);
  fan(side, 0, 1.5, R * 1.08, 7, .9, 1, "right", 2);
  // the left-hand half of the jumps, so they are not all stacked on one side
  side.forEach((idx, k) => {
    if (k % 2 === 0) return;
    const t = out.get(g.nodes[idx].key);
    if (t) { t.x = cx - (t.x - cx); t.label = "left"; }
  });

  /* The outer ring: the relatives of your relatives, small and faint. This is
     the depth cue, and the reason the middle feels like a place rather than a
     list. */
  const near = new Set([i, ...parents, ...children, ...jumps]);
  const ringTwo = [];
  for (const idx of [...parents, ...children]) {
    for (const [a, b] of g.edges) {
      const other = a === idx ? b : b === idx ? a : -1;
      if (other < 0 || near.has(other) || ringTwo.includes(other)) continue;
      ringTwo.push(other);
      if (ringTwo.length >= 10) break;
    }
    if (ringTwo.length >= 10) break;
  }
  ringTwo.forEach((idx, k) => {
    const ang = (k / Math.max(1, ringTwo.length)) * Math.PI * 2 - Math.PI / 2;
    out.set(g.nodes[idx].key, {
      x: cx + Math.cos(ang) * R * 1.85,
      y: cy + Math.sin(ang) * R * 1.85,
      r: 4.5, a: .42, ring: 2, idx, label: Math.cos(ang) < 0 ? "left" : "right", rank: 3,
    });
  });
  return out;
}
