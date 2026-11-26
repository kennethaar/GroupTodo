/* ▶ Present (#431): the page full screen as slides. It starts at the line
   you are in, or at the title, and Esc at the top gives the page back with
   the caret where it was. `root` presents one bullet and its lines (▶ Present
   on a focused line); with `on` it goes on through the bullets after it (☰ ›
   Present from here, on any page or day); `presenter` opens the presenter
   window at once (▾ › With presenter window). `step` opens it at that step,
   as a choice in the slide preview does (#465). With `wait` it opens on the
   waiting screen, counting down to the page's starts:: (#486). With `win`
   the slides open in a window of their own, beside the page (#515). */
function presentStart(path, {root = null, on = false, presenter = false, step = null, wait = false, win = false} = {}) {
  presentStop(true);
  slidePeekHide();
  slidePresented(path, true);
  const {steps, slides, hidden, broken} = deckSteps(path, root, on);
  const back = document.activeElement;
  const id = back && back.closest && back.closest(".blk")?.dataset.id;
  let at = 0;
  if (step != null) at = Math.max(0, Math.min(steps.length - 1, step));
  else if (id) {
    const i = steps.findIndex(({s, k}) => (k ? s.parts[k - 1] : s.block)?.id === id);
    if (i >= 0) at = i;
  }
  if (back && back.blur) back.blur();
  const deck = el("div", {id: "deck", role: "region", "aria-label": "Slides", "aria-live": "polite", tabindex: "-1"});
  const rec = LOADED.get(V.space);
  const own = [...(rec?.css || new Map())].filter(([p]) => isSlidesCssPath(p)).map(([, t]) => t).join("\n");
  if (own) deck.append(el("style", {class: "deckcss"}, own));
  /* With presenter window, that one opens first, straight from the click: a
     browser lets one pop-up through per click, and the speaker needs this one.
     The slides then take a window of their own if allowed. If not, the page
     stays as it is and Start presentation in the presenter window opens them. */
  if (presenter && !(PRESENTER_WIN && !PRESENTER_WIN.closed))
    PRESENTER_WIN = window.open("", "gtd-presenter", "popup,width=960,height=640") || null;
  const host = win ? slidesWinOpen(path, {quiet: presenter && !!PRESENTER_WIN}) : null;
  const later = !host && win && presenter && !!PRESENTER_WIN;
  DECK = {path, root, on, steps, slides, hidden, broken, i: -1, deck, back, digits: "", pw: null, t0: Date.now(), timer: 0, grid: false, edit: null, win: null, later};
  deck.addEventListener("dblclick", slideEdit);
  // Alt+drag places a line, the title or the picture's crop (#487).
  deck.addEventListener("pointerdown", slideArrDown, true);
  // A window of its own (#515), or this tab when pop-ups are blocked.
  if (!later) presentHost(host);
  SLIDE_ARR_PICK = null;
  DECK.timer = setInterval(presenterTick, 1000);
  // One still open from the last talk picks this one up (#515).
  if (presenter || (PRESENTER_WIN && !PRESENTER_WIN.closed)) presenterOpen();
  if (!host && !later) try { deck.requestFullscreen?.().then(() => navigator.keyboard?.lock?.(["Escape"])).catch(() => {}); } catch (e) {}
  deck.focus({preventScroll: true});
  if (!(wait && slideWaitBegin())) presentGo(at);
}
