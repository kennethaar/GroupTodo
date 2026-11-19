/* A burst of confetti over the page (#442): a short one from the middle, or a
   big one from both bottom corners. Only to look at: it takes no clicks, is
   hidden from screen readers, and is not drawn with reduced motion. */
function confetti(big = false) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const w = innerWidth, h = innerHeight, dpr = devicePixelRatio || 1;
  const cv = el("canvas", {class: "confetti" + (big ? " big" : ""), "aria-hidden": "true"});
  cv.width = w * dpr; cv.height = h * dpr;
  document.body.append(cv);
  const g = cv.getContext("2d");
  if (!g) { cv.remove(); return; }
  g.scale(dpr, dpr);
  const hues = ["#e53935", "#fb8c00", "#fdd835", "#43a047", "#1e88e5", "#8e24aa", "#ec407a"];
  const life = big ? 3600 : 1600;
  const from = big ? [[0, h, -1], [w, h, 1]] : [[w / 2, h * 0.55, 0]];
  const bits = [];
  for (const [x, y, side] of from)
    for (let i = 0; i < (big ? 160 : 70); i++) {
      // Up and out: from a corner inwards, from the middle any way up.
      const a = side ? -Math.PI / 2 - side * (0.15 + Math.random() * 0.6) : -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      const v = (big ? 13 : 8) + Math.random() * (big ? 9 : 6);
      bits.push({x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.4,
        s: 5 + Math.random() * 6, c: hues[i % hues.length]});
    }
  const t0 = performance.now();
  let last = t0;
  const frame = now => {
    const dt = Math.min(2, (now - last) / 16.7), t = now - t0;
    last = now;
    g.clearRect(0, 0, w, h);
    g.globalAlpha = Math.max(0, Math.min(1, (life - t) / 500));
    for (const b of bits) {
      b.vy += 0.32 * dt; b.vx *= 0.99; b.vy *= 0.99;
      b.x += b.vx * dt; b.y += b.vy * dt; b.r += b.vr * dt;
      g.save(); g.translate(b.x, b.y); g.rotate(b.r);
      g.fillStyle = b.c; g.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
      g.restore();
    }
    if (t < life && cv.isConnected) requestAnimationFrame(frame); else cv.remove();
  };
  requestAnimationFrame(frame);
}
