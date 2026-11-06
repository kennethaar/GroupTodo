function viewSolitaire() {
  solUse("p");
  const c = el("div", {class: "wrap wide"});
  c.append(vhead("Review projects", null, viewSeg("review")));
  /* The deck is dealt again whenever the areas on show change, or while it is
     empty because they were still opening. Cards already reviewed this session
     stay out of a new deal, so coming back never starts over -- and never
     claims everything is done just because the deck was dealt too early. */
  const vis = visibleSpaces().join("|");
  const pass = solPassNo(), P = SOL_PASSES[pass], last = pass === SD_PASS - 1;
  const passed = r => !!(SOL_ANS.get(solKey(r)) || {})["p" + pass];
  if (!SOL.order || SOL.vis !== vis || !SOL.order.length) {
    SOL.order = solOrder().filter(r => !passed(r)); SOL.i = 0; SOL.vis = vis;
  }
  const gone = r => !inS(r, () => V.pages.has(r.path));
  SOL.i -= SOL.order.slice(0, SOL.i).filter(gone).length;
  SOL.order = SOL.order.filter(r => !gone(r));
  /* The passes, down the side: where you are, and any of them can be dealt. */
  const passList = el("ol", {class: "solpasses", "aria-label": "Passes"}, ...SOL_PASSES.map((p, n) =>
    el("li", {}, el("button", {class: "solpass" + (n === pass ? " now" : "") + (n < pass ? " done" : ""),
      "aria-current": n === pass ? "step" : null, title: p.say, onclick: () => { if (n !== pass) solGoPass(n); }},
      el("span", {class: "n"}, n < pass ? svgIcon(ICON_CHECK) : String(n + 1)), el("span", {class: "q"}, p.name)))));
  // The someday pass is a game of its own: two cards, not a card and its answers.
  if (pass === SD_PASS || pass === HD_PASS) return viewSomeday(c, passList);
  // So is the loose actions pass: the card is an action, the answers where it goes.
  if (P.k === "loose") return viewLoose(c, passList);
  if (SOL.i >= SOL.order.length) {
    const any = solDeckAns().some(a => a["p" + pass]);
    const next = SOL_PASSES[pass + 1];
    c.append(emptyCard(
      el("div", {style: "font-size:34px"}, "🂡"),
      el("b", {}, last && any ? "Every project reviewed." : any ? "Pass " + (pass + 1) + " done: " + P.name + "."
        : pass ? "Nothing to ask in this pass." : "No projects to review here."), el("br"),
      !pass && !any ? "Open an area that has active projects, or include waiting and someday."
        : next ? "Next, pass " + (pass + 2) + ": " + next.say : "Each one now carries reviewed:: " + todayISO() + ".", el("br"),
      next ? null : [reviewOnward().say, el("br")], el("br"),
      next ? el("button", {class: "btn primary", onclick: () => solGoPass(pass + 1)}, "Deal pass " + (pass + 2) + ": " + next.name + " ›")
        : reviewOnward().btn,
      " ",
      NPM_QUEUE.length ? el("button", {class: "btn", onclick: () => npmOpen(NPM_QUEUE[0].space, NPM_QUEUE[0].path)},
        svgIcon(ICON_SPARKLE), " Plan " + NPM_QUEUE.length + (NPM_QUEUE.length === 1 ? " project" : " projects") + " again") : null,
      " ",
      SOL.past && SOL.past.length ? el("button", {class: "textbtn", title: "Backspace", onclick: () => solBack()}, svgIcon(ICON_CHEVRON_LEFT), " Back to the last card") : null,
      " ",
      el("button", {class: "textbtn", onclick: () => { solClearDeck(); solGoPass(0); }}, "Start over")));
    c.firstChild.after(passList);
    SOL.shown = null;
    return c;
  }
  const r = SOL.order[SOL.i];
  const steps = solSteps();
  const done = steps.filter(f => f.filled(r)).length;
  const f = solStepNow(r, steps), won = !f;
  if (won) { SOL.hold = null; SOL.step = null; }
  sideFollow(r.space, r.path);
  const info = inS(r, () => ({title: pageTitle(r.path), code: statusDirOf(r.path)}));
  /* The heading, the steps and how to play sit in a column beside the table,
     so the table gets the whole height of the window, even on a laptop. */
  c.classList.add("solwrap");
  const head = c.firstChild;
  c.append(el("aside", {class: "solside"}, head,
    passList,
    el("p", {class: "solhow"}, P.say),
    solDecks(pass),
    npmQueueList(),
    el("div", {class: "solcount"}, "Card " + (SOL.i + 1) + " of " + SOL.order.length + " · stalest first"),
    // Only the status pass goes through waiting and someday; the others are for what is active.
    pass ? null : el("div", {class: "solfilt"}, ...[["", "Active only"], ["1", "Waiting and someday too"]].map(([v, label]) => fchip(label, solAll() === !!v, () => {
      if (solAll() === !!v) return;
      PREF.set("sol.all", v);
      solGoPass(0);
    }))),
    el("ol", {class: "solsteps", "aria-label": "Questions"}, ...steps.map((s, i) => {
      const text = projectFieldText(r, s);
      return el("li", {}, el("button", {class: "solstep" + (s === f ? " now" : "") + (text ? " done" : ""),
        "aria-current": s === f ? "step" : null, title: text ? s.label + ": " + text + ". Click to change it." : SOL_ASK[s.k],
        onclick: () => { SOL.step = s.k; SOL.hold = s.type === "multi" && s.filled(r) ? s.k : null; SOL.more = null; SOL_KB = null; render(); }},
        el("span", {class: "n"}, text ? svgIcon(ICON_CHECK) : String(i + 1)), el("span", {class: "q"}, s.label),
        text ? el("span", {class: "v"}, text) : null));
    })),
    el("button", {class: "textbtn", onclick: () => solOp(r, "skip")}, "Skip this project ›"),
    SOL.past && SOL.past.length ? el("button", {class: "textbtn", title: "Backspace", onclick: () => solBack()}, "‹ Back to the last card") : null,
    el("p", {class: "solhow"}, "One question at a time. Drag the card onto an answer, or click one."),
    el("p", {class: "solhow"}, "Keys: the number on a box aims at it (numpad or number row); the same number again, or Enter, takes it. Arrows go from box to box, a letter to the answer starting with it. 5 goes back to the project, 5 twice skips it.")));
  solTable(c, pass, r, steps, f, done, won
      ? el("div", {class: "solcard won"}, parentLine(r.space, r.path), el("h3", {}, info.title),
          el("div", {class: "t-meta"}, el("span", {class: "chip ok"}, "Reviewed"), spaceBadge(r.space)),
          el("p", {}, "All " + steps.length + " questions of this pass are answered."),
          el("button", {class: "btn primary", onclick: () => solPassDone(r)}, "Next card ›"))
      : el("div", {class: "solcard", data: {solDrag: "1"}, tabindex: "0", title: "Drag onto an answer, or use the arrow keys"},
          parentLine(r.space, r.path),
          el("h3", {}, info.title),
          el("div", {class: "t-meta"}, spaceBadge(r.space), el("span", {class: "chip"}, STATUS_LABEL[info.code]),
            solHeld(r) ? el("span", {class: "chip"}, holdArrow(inS(r, () => projectHold(r.path)))) : null,
            el("span", {class: "chip"}, solIdle(r) == null ? "never reviewed" : "untouched for " + solIdle(r) + " days"),
            el("span", {class: "chip"}, openOf(projectActions(r)).length + " open")),
          el("div", {class: "t-meta"}, ...projectTags(r)),
          el("div", {class: "t-meta"},
            el("button", {class: "textbtn", onclick: () => previewPage(r.space, r.path, true)}, "Open the page"),
            Spaces.list.length > 1 ? el("button", {class: "textbtn", title: "Alt+S",
              onclick: () => openItemSpacePicker({space: r.space, path: r.path})}, "Move to another area") : null),
          el("div", {class: "solq"}, el("span", {}, "Question " + (steps.indexOf(f) + 1) + " of " + steps.length), el("b", {}, SOL_ASK[f.k])),
          el("div", {class: "prog", title: done + " of " + steps.length + " answered"},
            el("i", {style: "width:" + (done / steps.length * 100) + "%"}))));
  return c;
}
