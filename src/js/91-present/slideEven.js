/* Hub and spoke (#433): every bubble as big as the biggest, and far enough
   out from the core that each one's spoke shows, yet inside the ring, so
   none runs into the title. When that cannot be, the bubbles' words get
   smaller, a step at a time. Sizes are a share of the ring, so the slide
   can grow and shrink. Measured once the body is drawn. */
function slideEven(slide) {
  const ring = slide.querySelector(".hub"), core = ring && ring.querySelector(".hubcore");
  if (!ring || !ring.offsetWidth) return;
  const R = ring.offsetWidth, bubbles = [...ring.querySelectorAll(".ntext")], lines = [...ring.querySelectorAll(".sline")];
  const inner = core.offsetWidth / 2 / R * 100, SHOWN = 6;
  let W, H, r;
  for (let fit = 1; fit >= 0.5; fit = Math.round((fit - 0.1) * 10) / 10) {
    ring.style.setProperty("--hubfit", fit);
    for (const b of bubbles) { b.style.width = ""; b.style.height = ""; }
    W = Math.max(...bubbles.map(b => b.offsetWidth)) / R * 100;
    H = Math.max(...bubbles.map(b => b.offsetHeight)) / R * 100;
    // Out from the middle to where a bubble's edge meets its own spoke.
    const edge = b => Math.min(Math.abs(+b.dataset.c) > 1e-6 ? W / 2 / Math.abs(+b.dataset.c) : Infinity,
                               Math.abs(+b.dataset.s) > 1e-6 ? H / 2 / Math.abs(+b.dataset.s) : Infinity);
    r = Math.max(36, ...bubbles.map(b => inner + SHOWN + edge(b)));
    // Above and below, the ring's edge is the limit: the title is over it.
    if (bubbles.every(b => r * Math.abs(+b.dataset.s) + H / 2 <= 50)) break;
  }
  bubbles.forEach((b, i) => {
    const c = +b.dataset.c, s = +b.dataset.s;
    Object.assign(b.style, {width: W + "%", height: H + "%", left: 50 + r * c + "%", top: 50 + r * s + "%"});
    if (lines[i]) { lines[i].setAttribute("x2", 50 + r * c); lines[i].setAttribute("y2", 50 + r * s); }
  });
}
