/* Slide the page to a scroll position instead of jumping there, so a new
   paragraph glides to the middle. A new target mid-way picks up from where
   the page is; reduced motion, or a wheel or a press, stops it at once. */
function tpGlide(box, to) {
  const g = TELEPROMPT;
  cancelAnimationFrame(g.glide);
  g.glide = 0;
  to = Math.max(0, Math.min(to, box.scrollHeight - box.clientHeight));
  const from = box.scrollTop, d = to - from;
  if (Math.abs(d) < 2) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { box.scrollTop = to; return; }
  const t0 = performance.now(), ms = 320;
  const step = now => {
    const t = Math.max(0, Math.min(1, (now - t0) / ms)), ease = 1 - Math.pow(1 - t, 3);
    box.scrollTop = from + d * ease;
    g.glide = t < 1 ? requestAnimationFrame(step) : 0;
  };
  g.glide = requestAnimationFrame(step);
}
