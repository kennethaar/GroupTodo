// The presenter window drawn again for the step shown on the big screen.
function presenterDraw() {
  const pw = DECK?.pw;
  if (!pw || pw.closed) return;
  const d = pw.document, {steps, slides, i} = DECK, here = steps[i], s = here.s;
  const lit = here.k ? s.kids[here.k - 1] : null;
  const next = steps[i + 1];
  const nextText = !next ? "The end" : next.s === s ? "› " + slideWords(s.kids[next.k - 1]) : "Slide: " + next.s.title;
  const size = +PREF.get("present.notes", 22) || 22;
  const resize = by => { PREF.set("present.notes", Math.max(12, Math.min(48, size + by))); presenterDraw(); };
  const bar = el("div", {class: "pbar"},
    el("span", {class: "pcount"}, s.n + " / " + slides.length),
    el("button", {class: "ptimer", title: "Time since you started. Click to start again"}, ""),
    el("span", {class: "pclock"}, ""),
    el("span", {class: "pgap"}),
    el("button", {class: "poverview", "aria-pressed": String(DECK.grid), title: "All slides (O)",
      onclick: () => { DECK.grid = !DECK.grid; presenterDraw(); }}, "Overview"),
    el("button", {class: "psmaller", title: "Smaller notes", "aria-label": "Smaller notes", onclick: () => resize(-2)}, "A−"),
    el("button", {class: "pbigger", title: "Larger notes", "aria-label": "Larger notes", onclick: () => resize(2)}, "A+"));
  bar.querySelector(".ptimer").onclick = () => { if (DECK) { DECK.t0 = Date.now(); presenterTick(); } };
  const list = el("ul", {}, ...s.kids.map((b, n) =>
    el("li", {class: n < here.k - 1 ? "past" : n === here.k - 1 ? "now" : "later"}, slideWords(b))));
  const main = el("div", {class: "pmain"},
    el("div", {class: "pnow"}, el("div", {class: "plabel"}, "Now"), el("h2", {}, s.title), list),
    el("div", {class: "pnext"}, el("div", {class: "plabel"}, "Next"), el("div", {class: "pwhat"}, nextText)));
  const notes = el("div", {class: "pnotes", style: "font-size:" + size + "px"}, lit ? slideNotes(lit).notes : s.notes);
  const parts = [bar, main, notes];
  if (DECK.grid) parts.push(el("div", {class: "pgrid", role: "list", "aria-label": "All slides"},
    ...slides.map(t => el("button", {class: "pthumb" + (t === s ? " here" : "") + (t.depth ? " sub" : ""), role: "listitem",
      onclick: () => { DECK.grid = false; presentGo(t.first); }}, t.title))));
  d.body.replaceChildren(...parts.map(n => d.adoptNode(n)));
  presenterTick();
}
