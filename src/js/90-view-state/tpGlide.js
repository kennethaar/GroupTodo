/* Slide the page to a scroll position instead of jumping there, so a new
   paragraph glides to the middle (#324). Each frame closes the same share of
   what is left, measured in time, not frames, so it feels alike on any screen.
   A new target while it runs only moves the aim: the slide never stops and
   starts again, which is what made fast typing jerk. Reduced motion, or a
   wheel or a press, stops it at once. */
function tpGlide(box, to) {
  const g = TELEPROMPT;
  g.to = Math.max(0, Math.min(to, box.scrollHeight - box.clientHeight));
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cancelAnimationFrame(g.glide); g.glide = 0; box.scrollTop = g.to; return;
  }
  if (g.glide) return;
  if (Math.abs(g.to - box.scrollTop) < 1) return;
  let pos = box.scrollTop, last = performance.now();
  const step = now => {
    const dt = Math.max(0, now - last);
    last = now;
    pos += (g.to - pos) * (1 - Math.exp(-dt / 80));   // settles in about 300 ms
    if (Math.abs(g.to - pos) < 0.5) pos = g.to;
    box.scrollTop = pos;
    g.glide = pos === g.to ? 0 : requestAnimationFrame(step);
  };
  g.glide = requestAnimationFrame(step);
}
