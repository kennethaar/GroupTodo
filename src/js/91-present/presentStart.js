/* ▶ Present (#431): the page full screen as slides. It starts at the line
   you are in, or at the title, and Esc at the top gives the page back with
   the caret where it was. */
function presentStart(path) {
  presentStop();
  const {steps, slides} = deckSteps(path);
  const back = document.activeElement;
  const id = back && back.closest && back.closest(".blk")?.dataset.id;
  let at = 0;
  if (id) {
    const i = steps.findIndex(({s, k}) => (k ? s.kids[k - 1] : s.block)?.id === id);
    if (i >= 0) at = i;
  }
  if (back && back.blur) back.blur();
  const deck = el("div", {id: "deck", role: "region", "aria-label": "Slides", "aria-live": "polite", tabindex: "-1"});
  const rec = LOADED.get(V.space);
  const own = [...(rec?.css || new Map())].filter(([p]) => isSlidesCssPath(p)).map(([, t]) => t).join("\n");
  if (own) deck.append(el("style", {class: "deckcss"}, own));
  document.body.append(deck);
  DECK = {path, steps, slides, i: -1, deck, back, digits: "", pw: null, t0: Date.now(), timer: 0, grid: false};
  window.addEventListener("keydown", presentKey, true);
  DECK.timer = setInterval(presenterTick, 1000);
  try { deck.requestFullscreen?.().then(() => navigator.keyboard?.lock?.(["Escape"])).catch(() => {}); } catch (e) {}
  deck.focus({preventScroll: true});
  presentGo(at);
}
