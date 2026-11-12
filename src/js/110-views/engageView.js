/* Engage (#360): the first action Next › List would show in this context,
   with its filters and order, and nothing else. Done ticks it as a tick in
   Next does; Skip leaves the file be and deals the next one. When none are
   left, the skipped ones can be dealt again. */
function engageView(acts, ctx) {
  const E = ENGAGE;
  const left = acts.filter(a => !E.seen.has(engageKey(a)));
  const dealt = E.done + E.skipped.length;
  const where = ctx === CTX_NONE ? "No context" : contextLabel(ctx);
  const box = el("div", {class: "wrap engage"});
  const a = left[0];
  let first;
  if (!a) {
    const tally = [E.done ? E.done + " done" : "", E.skipped.length ? E.skipped.length + " skipped" : ""].filter(Boolean).join(", ");
    const again = E.skipped.length ? el("button", {class: "btn primary", onclick: () => {
      for (const k of E.skipped) E.seen.delete(k);
      E.skipped = []; E.done = 0; render();
    }}, "Go through the skipped ones") : null;
    const leave = el("button", {class: "btn" + (again ? " ghost" : " primary"), onclick: () => setWritingFocus(false)}, "Leave focus");
    first = again || leave;
    box.append(el("div", {class: "engage-card engage-end", role: "status"},
      el("h2", {}, ctx === CTX_NONE ? "Nothing left with no context." : "Nothing left at " + where + "."),
      tally ? el("p", {class: "engage-n"}, tally + ".") : null,
      el("div", {class: "engage-btns"}, again, leave)));
  } else {
    // The context is the heading; urgency, age and wording hints are for choosing, not doing.
    const chips = chipsFor(a, {}).filter(c => !c.matches(".ctx, .urg, .age, .miss"));
    first = el("button", {class: "btn primary engage-done", onclick: () => {
      E.seen.add(engageKey(a)); E.done++;
      rowSetState(a, () => setBlockState(a.path, a.block, "DONE", {nextNow: true}));
    }}, "Done ", el("kbd", {}, "Enter"));
    box.append(el("div", {class: "engage-card"},
      el("div", {class: "engage-where"}, where + " · " + (dealt + 1) + " of " + (dealt + left.length)),
      el("div", {class: "engage-title", html: estHtml(a.title) + renderInline(titleForLine(a.title))}),
      chips.length ? el("div", {class: "engage-meta"}, ...chips) : null,
      el("div", {class: "engage-btns"}, first,
        el("button", {class: "btn engage-skip", onclick: () => {
          E.seen.add(engageKey(a)); E.skipped.push(engageKey(a)); render();
        }}, "Skip ", el("kbd", {}, "→")))));
  }
  // The button is where the keyboard is, so Enter and Space work at once.
  queueMicrotask(() => { if (first.isConnected && !document.activeElement?.closest?.(".modal")) first.focus({preventScroll: true}); });
  return box;
}
