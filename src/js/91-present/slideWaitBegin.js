/* The slides shown turn to the waiting screen (#486), counting down to the
   page's starts::. Also from a talk already running, as ⏱ in the presenter
   window does (#489): the same deck and presenter window stay. */
function slideWaitBegin() {
  const when = DECK && slideWaitAt(DECK.path);
  if (!when) return false;
  const {deck} = DECK;
  if (DECK.edit) slideEditEnd(false);
  if (DECK.wait) clearInterval(DECK.wait.tick);
  for (const n of deck.querySelectorAll(".waitband, .waitdots, .slide")) n.remove();
  DECK.i = -1;
  DECK.grid = false;
  DECK.wait = {...when, n: 0, shown: 0, slides: slideWaitSlides(DECK.path), tick: setInterval(slideWaitTick, 1000)};
  deck.classList.add("waiting");
  deck.append(el("div", {class: "waitdots", "aria-hidden": "true"}, ...DECK.wait.slides.map(() => el("span", {}))),
    el("div", {class: "waitband", role: "timer"}, el("span", {class: "waitwhen"}), el("span", {class: "waitclock"})));
  slideWaitShow(0);
  presenterDraw();
  slideWaitTick();
  return true;
}
