/* Hub and spoke (#433): every bubble as big as the biggest, and far enough
   out from the core that each one's spoke shows, yet inside the ring, so
   none runs into the title. When that cannot be, the bubbles' words get
   smaller, a step at a time. Sizes are a share of the ring, so the slide
   can grow and shrink. Measured once the body is drawn. */
function slideEven(slide) {
  const ring = slide.querySelector(".hub"), core = ring && ring.querySelector(".hubcore");
  if (!ring || !ring.offsetWidth) return;
  // The title in the hub gets smaller until it fits the circle whole (#433 follow-up).
  core.classList.remove("wrapany");
  for (let fit = 1; ; fit = Math.round((fit - 0.05) * 100) / 100) {
    ring.style.setProperty("--corefit", fit);
    if (core.scrollHeight <= core.clientHeight + 1 && core.scrollWidth <= core.clientWidth + 1) break;
    if (fit <= 0.4) { core.classList.add("wrapany"); break; }
  }
  const R = ring.offsetWidth, bubbles = [...ring.querySelectorAll(".ntext")], lines = [...ring.querySelectorAll(".sline")];
  const inner = core.offsetWidth / 2 / R * 100, SHOWN = 6;
  let W, H, r;
  /* A word longer than a bubble may be runs out past its border, since a
     word is never cut (#433 follow-up): the words get smaller until each
     bubble holds its longest one. */
  const wide = () => bubbles.some(b => b.scrollWidth > b.clientWidth + 1);
  for (let fit = 1; fit >= 0.3; fit = Math.round((fit - 0.1) * 10) / 10) {
    ring.style.setProperty("--hubfit", fit);
    for (const b of bubbles) { b.style.width = ""; b.style.height = ""; }
    W = Math.max(...bubbles.map(b => b.offsetWidth)) / R * 100;
    H = Math.max(...bubbles.map(b => b.offsetHeight)) / R * 100;
    // Out from the middle to where a bubble's edge meets its own spoke.
    const edge = b => Math.min(Math.abs(+b.dataset.c) > 1e-6 ? W / 2 / Math.abs(+b.dataset.c) : Infinity,
                               Math.abs(+b.dataset.s) > 1e-6 ? H / 2 / Math.abs(+b.dataset.s) : Infinity);
    r = Math.max(36, ...bubbles.map(b => inner + SHOWN + edge(b)));
    // Above and below, the ring's edge is the limit: the title is over it.
    // Below half size only a word too long for its bubble makes them smaller still.
    if (!wide() && (fit <= 0.5 || bubbles.every(b => r * Math.abs(+b.dataset.s) + H / 2 <= 50))) break;
  }
  bubbles.forEach((b, i) => {
    const c = +b.dataset.c, s = +b.dataset.s;
    Object.assign(b.style, {width: W + "%", height: H + "%", left: 50 + r * c + "%", top: 50 + r * s + "%"});
    if (lines[i]) { lines[i].setAttribute("x2", 50 + r * c); lines[i].setAttribute("y2", 50 + r * s); }
  });
  /* Bubbles at the sides can reach past the ring. Beside a card the ring
     makes room for them, so the card covers none (#433 follow-up). */
  if (ring.parentElement?.classList.contains("hubwrap")) {
    ring.style.marginLeft = ring.style.marginRight = "";
    const box = ring.getBoundingClientRect(), rs = bubbles.map(b => b.getBoundingClientRect());
    ring.style.marginLeft = Math.max(0, box.left - Math.min(...rs.map(x => x.left))) + "px";
    ring.style.marginRight = Math.max(0, Math.max(...rs.map(x => x.right)) - box.right) + "px";
  }
}
