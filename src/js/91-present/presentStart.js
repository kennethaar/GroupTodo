/* ▶ Present (#431): the page full screen as slides. It starts at the line
   you are in, or at the title, and Esc at the top gives the page back with
   the caret where it was. `root` presents one bullet and its lines (▶ Present
   on a focused line); with `on` it goes on through the bullets after it (☰ ›
   Present from here, on any page or day); `presenter` opens the presenter
   window at once (▾ › With presenter window). */
function presentStart(path, {root = null, on = false, presenter = false} = {}) {
  presentStop();
  slidePresented(path, true);
  const {steps, slides, hidden} = deckSteps(path, root, on);
  const back = document.activeElement;
  const id = back && back.closest && back.closest(".blk")?.dataset.id;
  let at = 0;
  if (id) {
    const i = steps.findIndex(({s, k}) => (k ? s.parts[k - 1] : s.block)?.id === id);
    if (i >= 0) at = i;
  }
  if (back && back.blur) back.blur();
  const deck = el("div", {id: "deck", role: "region", "aria-label": "Slides", "aria-live": "polite", tabindex: "-1"});
  const rec = LOADED.get(V.space);
  const own = [...(rec?.css || new Map())].filter(([p]) => isSlidesCssPath(p)).map(([, t]) => t).join("\n");
  if (own) deck.append(el("style", {class: "deckcss"}, own));
  document.body.append(deck);
  DECK = {path, root, steps, slides, hidden, i: -1, deck, back, digits: "", pw: null, t0: Date.now(), timer: 0, grid: false};
  window.addEventListener("keydown", presentKey, true);
  DECK.timer = setInterval(presenterTick, 1000);
  // The presenter window first: a pop-up is only allowed straight from the click.
  if (presenter) presenterOpen();
  try { deck.requestFullscreen?.().then(() => navigator.keyboard?.lock?.(["Escape"])).catch(() => {}); } catch (e) {}
  deck.focus({preventScroll: true});
  presentGo(at);
}
