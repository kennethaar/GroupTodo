function viewActSolitaire() {
  solUse("a");
  const c = el("div", {class: "wrap wide"});
  const head = vhead("Review actions", null, viewSeg("review"));
  const vis = visibleSpaces().join("|");
  const pass = solPassNo(), P = ACT_PASSES[pass];
  if (!SOL.order || SOL.vis !== vis || !SOL.order.length) { SOL.order = actOrder(pass); SOL.i = 0; SOL.vis = vis; }
  SOL.i -= SOL.order.slice(0, SOL.i).filter(r => !actHere(r)).length;
  SOL.order = SOL.order.filter(actHere);
  // The passes, each with how many cards it still has to deal.
  const left = ACT_PASSES.map((p, n) => n === pass ? Math.max(0, SOL.order.length - SOL.i) : actOrder(n).length);
  const passList = el("ol", {class: "solpasses", "aria-label": "Passes"}, ...ACT_PASSES.map((p, n) =>
    el("li", {}, el("button", {class: "solpass" + (n === pass ? " now" : "") + (n < pass ? " done" : ""),
      "aria-current": n === pass ? "step" : null, title: p.say, onclick: () => { if (n !== pass) actGoPass(n); }},
      el("span", {class: "n"}, n < pass && !left[n] ? "✓" : String(n + 1)),
      el("span", {class: "q"}, p.name + (left[n] ? " · " + left[n] : ""))))));
  if (SOL.i >= SOL.order.length) {
    const any = solDeckAns().some(a => a["p" + pass]);
    const next = ACT_PASSES[pass + 1];
    c.append(head, passList, emptyCard(
      el("div", {style: "font-size:34px"}, "🂡"),
      el("b", {}, any ? "Pass " + (pass + 1) + " done: " + P.name + "." : pass ? "Nothing to ask in this pass." : "No next actions of yours here."), el("br"),
      next ? "Next, pass " + (pass + 2) + ": " + next.say : "That was the last pass.", el("br"), actChoresNote() || el("br"),
      next ? el("button", {class: "btn primary", onclick: () => actGoPass(pass + 1)}, "Deal pass " + (pass + 2) + ": " + next.name + " ›")
        : el("button", {class: "btn primary", onclick: () => go("review", {sub: "projects"})}, "Review the projects ›"),
      " ",
      SOL.past && SOL.past.length ? el("button", {class: "textbtn", title: "Backspace", onclick: () => solBack()}, "‹ Back to the last card") : null,
      " ",
      el("button", {class: "textbtn", onclick: () => { solClearDeck(); actGoPass(0); }}, "Start over")));
    SOL.shown = null;
    return c;
  }
  const r = SOL.order[SOL.i];
  const steps = solSteps();
  const done = steps.filter(f => f.filled(r)).length;
  const f = solStepNow(r, steps);
  if (!f) { SOL.hold = null; SOL.step = null; }
  sideFollow(r.space, r.path);
  c.classList.add("solwrap");
  c.append(el("aside", {class: "solside"}, head, passList,
    el("p", {class: "solhow"}, P.say),
    solDecks(pass),
    el("div", {class: "solcount"}, "Card " + (SOL.i + 1) + " of " + SOL.order.length + " · oldest first"),
    actChoresNote(),
    el("button", {class: "textbtn", onclick: () => solOp(r, "skip")}, "Skip this action ›"),
    SOL.past && SOL.past.length ? el("button", {class: "textbtn", title: "Backspace", onclick: () => solBack()}, "‹ Back to the last card") : null,
    el("p", {class: "solhow"}, "Drag the card onto an answer, or click one. Everything is written on the line itself."),
    el("p", {class: "solhow"}, f && f.k === "home"
      ? "Keys: ↑ ↓ go down a column, ← → across to the other, a letter to the name starting with it, Enter files the action there."
      : "Keys: the number on a box aims at it (numpad or number row); the same number again, or Enter, takes it. Arrows go from box to box, a letter to the answer starting with it. 5 goes back to the action, 5 twice skips it.")));
  if (f && f.k === "home") return actHomeTable(c, r, f);
  return solTable(c, pass, r, steps, f, done, actFace(r, f));
}
