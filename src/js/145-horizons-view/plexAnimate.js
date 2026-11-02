/* One animation for the whole plex: every dot eases toward where it belongs,
   which is what makes a change of focus readable instead of a cut. */
function plexAnimate(cv, g, getTargets, getHover) {
  if (PLEX.anim) cancelAnimationFrame(PLEX.anim);
  const step = () => {
    PLEX.anim = null;
    if (!cv.isConnected) return;
    const w = cv.clientWidth, h = cv.clientHeight;
    const targets = getTargets(w, h);
    let moving = false;
    for (const [k, t] of targets) {
      let p = PLEX.pos.get(k);
      if (!p) {
        // Arriving from where the middle is, so new relatives fly outward.
        const from = PLEX.pos.get(plexFocus());
        p = {x: from ? from.x : w / 2, y: from ? from.y : h / 2, r: 1, a: 0};
        PLEX.pos.set(k, p);
      }
      for (const f of ["x", "y", "r", "a"]) {
        const d = t[f] - p[f];
        if (Math.abs(d) > (f === "a" ? 0.004 : 0.4)) moving = true;
        p[f] += d * 0.22;
      }
    }
    for (const k of [...PLEX.pos.keys()]) {
      if (targets.has(k)) continue;
      const p = PLEX.pos.get(k);
      p.a += (0 - p.a) * 0.3;
      if (p.a < 0.02) PLEX.pos.delete(k); else moving = true;
    }
    plexDraw(cv, g, targets, getHover());
    if (moving || PLEX.drag) PLEX.anim = requestAnimationFrame(step);
  };
  PLEX.anim = requestAnimationFrame(step);
}
