function viewDayReview() {
  clSettle();
  // The catch-up's mini review asks only about the lines the AI wrote (#516 follow-up).
  const run = CU_RUN && CU_RUN.phase === "clarify";
  const deck = run ? clarifyDeck().filter(r => CU_RUN.ids.has(r.block.id)) : clarifyDeck();
  if (run && !deck.length) { cuToSort(); return viewActSolitaire(); }
  const head = run ? cuRunHead("Step 1 of 2: something to do, or a note? " + deck.length + " of " + CU_RUN.total + " left")
    : vhead("Weekly review", deck.length ? deck.length + (deck.length === 1 ? " line" : " lines") + " to clarify" : "Clarify", viewSeg("review"));
  /* What the last answer did, said where you look, with the one way to take
     it back. Pressed again, it goes on to the answer before (#365). */
  const u = CL.undos[CL.undos.length - 1];
  const undo = u ? el("div", {class: "cllast", role: "status"},
    svgIcon(ICON_CHECK), el("span", {translate: "no"}, " Last: \u201C" + u.title + "\u201D \u2192 " + u.label + " "),
    el("button", {class: "textbtn", title: "Backspace", onclick: clUndo}, "Undo that")) : null;
  if (!deck.length) {
    CL.shown = null;
    if (SIDE_PAGE && SIDE_PAGE.at) SIDE_PAGE = null;
    const c = el("div", {class: "wrap"});
    const bigCheck = svgIcon(ICON_CHECK);
    bigCheck.setAttribute("style", "width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round");
    c.append(head, emptyCard(el("div", {}, bigCheck),
      el("b", {}, "Every loose line of the last two weeks is clarified."), el("br"), el("br"),
      el("button", {class: "btn primary", onclick: () => go("review", {sub: "actions"})}, "On to the next actions ›"), undo));
    return c;
  }
  if (run || PREF.get("clarify.quick", "")) return viewQuickClarify(deck[0], head, undo, run);
  const r = deck[0], {path, block: b} = r;
  /* The day around the line, beside the card, the line at the middle of it
     and the rest to scroll through, so a note reads in its context (#376).
     Close puts it away until you ask for it again. */
  const beside = !NARROW.matches;
  if (beside && !CL.noSide) {
    SIDE_PAGE = {space: V.space, path, at: b.id};
    // Under a folded line it would not be drawn there: unfold the way to it.
    for (const up of (branchTrail(getPage(path).blocks, b.id) || []).slice(0, -1)) up.collapsed = false;
  }
  const c = el("div", {class: "wrap wide solwrap clarify"});
  c.append(el("aside", {class: "solside"}, head, clMode(),
    el("p", {class: "solhow"}, "One line from your day pages at a time, oldest first. Ask: what is it?"),
    el("button", {class: "textbtn", onclick: () => clSkip(r)}, "Skip this line ›"),
    beside && CL.noSide ? el("button", {class: "textbtn", onclick: () => { CL.noSide = false; render(); }}, "Show the day page beside it")
      : el("button", {class: "textbtn", onclick: () => openBlockAt(V.space, path, b)}, "Open the day page"),
    el("p", {class: "solhow"}, "Keys: numbers as on a numpad, the line is 5; a letter aims too. Enter or the same number again takes it. Backspace undoes.")));
  const kids = (b.children || []).filter(k => trim(plainTitle(k.title || "")) && !isMessage(k));
  /* Meeting notes: the heading and its whole branch, every level, notes in
     one go and one undo (#366, #518). What is ticked is no note and stays. */
  const under = new Set(), down = bs => { for (const k of bs || []) { under.add(k); down(k.children); } };
  down(b.children);
  const asked = deck.filter(x => x.path === path && under.has(x.block));
  const allLabel = "Leave it and the " + (asked.length === 1 ? "line" : asked.length) + " under it as notes";
  CL.allAns = asked.length ? {label: "Notes, with the " + asked.length + " under it",
    how: allLabel + ": every level, in one go.", run: p => asked.forEach(x => clDeal(p, x.block))} : null;
  if (CL.aim === "all" && !CL.allAns) CL.aim = 0;
  const allNotes = CL.allAns ? el("button", {class: "clans clall" + (CL.aim === "all" ? " on" : ""), data: {k: "0"},
    title: CL.allAns.how, onmouseenter: () => { CL.aim = "all"; clPaint(); }, onfocus: () => { CL.aim = "all"; clPaint(); },
    onclick: () => clAnswer(r, CL.allAns)},
    el("span", {class: "n"}, "0"), el("span", {class: "lbl"}, el("b", {}, allLabel), el("small", {}, "every level, in one go"))) : null;
  // A table reads as the table it is, as on the page (#375).
  const asLine = k => tableRows(k) ? tableHtml(k) : renderInline(bujoText(k.title));
  const h3 = tableRows(b) ? el("div", {class: "cltable", translate: "no", role: "heading", "aria-level": "3", html: asLine(b)})
    : el("h3", {translate: "no", html: asLine(b)});
  // The line is 5, in the middle of the answers, as the card in Review actions (#518).
  const card = el("div", {class: "clcard" + (CL.aim === "line" ? " on" : ""), data: {k: "5"},
    onmouseenter: () => { CL.aim = "line"; clPaint(); }},
    el("span", {class: "n", title: "5 again skips it"}, "5"),
    el("div", {class: "cleye"}, dayLong(baseName(path)) +
      (r.trail.length ? " · under “" + r.trail[r.trail.length - 1] + "”" : "")),
    h3, ...clKinds(path, b, h3),
    kids.length ? el("ul", {class: "clkids", translate: "no"}, ...kids.slice(0, 5).map(k =>
      el("li", {html: asLine(k)})), kids.length > 5 ? el("li", {}, "…") : null) : null);
  let n = 0;
  /* Laid out like a numpad, each answer at its key (#518). */
  const groups = el("div", {class: "clgroups"}, ...CL_GROUPS.map((g, gi) => el("section", {class: "clgroup"},
    el("h4", {}, g),
    ...CL_ANSWERS.filter(a => a.g === gi).map(a => {
      const i = n++;
      return el("button", {class: "clans" + (i === CL.aim ? " on" : ""), title: a.how, data: {k: String(a.key)},
        onmouseenter: () => { CL.aim = i; clPaint(); }, onfocus: () => { CL.aim = i; clPaint(); },
        onclick: () => clAnswer(r, a)},
        el("span", {class: "n"}, String(a.key)),
        el("span", {class: "lbl"}, el("b", {}, a.label), el("small", {}, a.say)));
    }))), card, allNotes);
  /* The answers first, at one spot: the card under them changes height with
     each line, and the undo comes and goes, so above they would move and a
     press would land on the wrong one (#461). */
  c.append(el("div", {class: "sdduel"}, el("div", {class: "solq"}, el("b", {}, "What is it?")), groups,
    el("p", {class: "clhow"}),
    // Lines dragged in the day page take the answer instead (#460).
    el("p", {class: "clpicked", role: "status", hidden: true}, el("span"),
      el("button", {class: "textbtn", onclick: () => lineSelClear()}, "Let go")), undo));
  CL.shown = r;
  clPaint(c);
  return c;
}
