/* The slide you were last on, small, beside a Present button while it is
   hovered or focused (#465): ▶ Present at the top, or ☰ › Present from here
   (`side`: beside the menu row, not under it). Never shown: the slide it
   starts on. It is drawn as the deck draws it, scaled down. */
function slidePeek(anchor, path, root = null, on = false, side = false) {
  if (DECK || !anchor || !anchor.isConnected) return;
  const from = slideLast(path, root);
  const {steps, slides} = deckSteps(path, root, on);
  if (!steps.length) return;
  const old = $(".slidepeek");
  const at = Math.max(0, Math.min(steps.length - 1, from));
  if (old && old._anchor === anchor && old.dataset.at === path + "\u0000" + at) return;
  slidePeekHide();
  const step = steps[at];
  const stage = el("div", {id: "deckpeek", "aria-hidden": "true"});
  const rec = LOADED.get(V.space);
  const own = [...(rec?.css || new Map())].filter(([p]) => isSlidesCssPath(p)).map(([, t]) => t).join("\n");
  if (own) stage.append(el("style", {class: "deckcss"}, own));
  const W = 240, k = W / innerWidth;
  stage.style.transform = `scale(${k})`;
  const peek = el("div", {class: "slidepeek", id: "slidepeek", role: "tooltip"},
    el("div", {class: "peekstage", style: `width:${W}px;height:${Math.round(innerHeight * k)}px`}, stage),
    el("div", {class: "peeksays"}, from < 0 ? "Starts here" : `Last time: slide ${step.s.n} of ${slides.length}`));
  peek._anchor = anchor;
  peek.dataset.at = path + "\u0000" + at;
  document.body.append(peek);
  const slide = slideSection(step.s);
  stage.append(slide);
  resolveAssets(slide);
  slideBullets(slide, step, false);
  anchor.setAttribute("aria-describedby", "slidepeek");
  // Under the button, or above it with no room; beside a menu row.
  const a = anchor.getBoundingClientRect(), p = peek.getBoundingClientRect(), m = 8;
  let x, y;
  if (side) {
    x = a.right + m + p.width <= innerWidth ? a.right + m : a.left - m - p.width;
    y = a.top;
  } else {
    x = a.left;
    y = a.bottom + m + p.height <= innerHeight ? a.bottom + m : a.top - m - p.height;
  }
  peek.style.left = Math.max(m, Math.min(innerWidth - p.width - m, x)) + "px";
  peek.style.top = Math.max(m, Math.min(innerHeight - p.height - m, y)) + "px";
  // The button redrawn or the menu shut: the preview goes with it.
  const watch = () => {
    if (!peek.isConnected) return;
    if (!anchor.isConnected) { slidePeekHide(); return; }
    requestAnimationFrame(watch);
  };
  requestAnimationFrame(watch);
}
