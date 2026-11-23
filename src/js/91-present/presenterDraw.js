// The presenter window drawn again for the step shown on the big screen.
function presenterDraw() {
  const pw = DECK?.pw;
  if (!pw || pw.closed) return;
  // Waiting for the start (#486): the countdown, and a button that starts the talk (#489).
  if (DECK.wait) {
    const go = el("button", {class: "pnext pgo", onclick: slideWaitEnd},
      el("div", {class: "plabel"}, "Next"), el("div", {class: "pwhat"}, "Start the talk"));
    pw.document.body.replaceChildren(...[el("p", {class: "pend pwait", role: "timer"}, ""), go].map(n => pw.document.adoptNode(n)));
    slideWaitTick();
    return;
  }
  if (!DECK.steps[DECK.i]) return;   // drawn once the first slide is up
  const d = pw.document, {steps, slides, i} = DECK, here = steps[i], s = here.s;
  const lit = here.k ? s.parts[here.k - 1] : null;
  const next = steps[i + 1];
  const nextText = !next ? "The end" : next.s === s ? "› " + slideWords(s.parts[next.k - 1]) : "Slide: " + next.s.title;
  const size = +PREF.get("present.notes", 22) || 22;
  const resize = by => { PREF.set("present.notes", Math.max(12, Math.min(48, size + by))); presenterDraw(); };
  const bar = el("div", {class: "pbar"},
    // Lines left off the slides (#467) are counted, so none goes without a trace.
    el("span", {class: "pcount"}, s.n + " / " + slides.length + (DECK.hidden ? " · " + DECK.hidden + " hidden" : "")),
    el("button", {class: "ptimer", title: "Time since you started. Click to start again"}, ""),
    el("span", {class: "pclock"}, ""),
    el("span", {class: "pgap"}),
    // The countdown, started from here too (#489).
    el("button", {class: "pwaitbtn", "aria-expanded": String(!!DECK.pwTimes), title: "Count down to the start, with the waiting slides",
      onclick: () => { DECK.pwTimes = !DECK.pwTimes; presenterDraw(); }}, "⏱ Count down…"),
    el("button", {class: "poverview", "aria-pressed": String(DECK.grid), title: "All slides (O)",
      onclick: () => { DECK.grid = !DECK.grid; presenterDraw(); }}, "Overview"),
    el("button", {class: "psmaller", title: "Smaller notes", "aria-label": "Smaller notes", onclick: () => resize(-2)}, "A−"),
    el("button", {class: "pbigger", title: "Larger notes", "aria-label": "Larger notes", onclick: () => resize(2)}, "A+"));
  bar.querySelector(".ptimer").onclick = () => { if (DECK) { DECK.t0 = Date.now(); presenterTick(); } };
  const list = el("ul", {}, ...s.parts.map((b, n) =>
    el("li", {class: n < here.k - 1 ? "past" : n === here.k - 1 ? "now" : "later", "data-bid": b.id}, slideText(b))));
  const main = el("div", {class: "pmain"},
    el("div", {class: "pnow"}, el("div", {class: "plabel"}, "Now"), el("h2", {class: "stitle"}, s.title), list),
    // The Next box is the button that goes on; ‹ Back beside it (#489), for a mouse or a touch screen.
    el("div", {class: "pside"},
      el("button", {class: "pback", disabled: i === 0 ? "" : null, onclick: () => presentGo(DECK.i - 1)}, "‹ Back"),
      el("button", {class: "pnext", disabled: next ? null : "", onclick: () => presentGo(DECK.i + 1)},
        el("div", {class: "plabel"}, "Next"), el("div", {class: "pwhat"}, nextText))));
  const notes = el("div", {class: "pnotes", style: "font-size:" + size + "px"}, lit ? slideNotes(lit).notes : s.notes);
  const parts = DECK.pwTimes ? [bar, presenterTimes(), main, notes] : [bar, main, notes];
  if (DECK.grid) parts.push(el("div", {class: "pgrid", role: "list", "aria-label": "All slides"},
    ...slides.map(t => el("button", {class: "pthumb" + (t === s ? " here" : "") + (t.depth ? " sub" : ""), role: "listitem",
      onclick: () => { DECK.grid = false; presentGo(t.first); }}, t.title,
      // A drawn slide says how it is drawn (#433); a plain list says nothing.
      t.layout !== "list" ? el("span", {class: "playout"}, " · " + SLIDE_LAYOUTS[t.layout].name) : null))));
  d.body.replaceChildren(...parts.map(n => d.adoptNode(n)));
  presenterTick();
}
