function viewDayReview() {
  clSettle();
  const deck = clarifyDeck();
  const head = vhead("Weekly review", deck.length ? deck.length + (deck.length === 1 ? " line" : " lines") + " to clarify" : "Clarify", viewSeg("review"));
  /* What the last answer did, said where you look, with the one way to take
     it back. Pressed again, it goes on to the answer before (#365). */
  const u = CL.undos[CL.undos.length - 1];
  const undo = u ? el("div", {class: "cllast", role: "status"},
    svgIcon(ICON_CHECK), el("span", {translate: "no"}, " Last: \u201C" + u.title + "\u201D \u2192 " + u.label + " "),
    el("button", {class: "textbtn", title: "Backspace", onclick: clUndo}, "Undo that")) : null;
  if (!deck.length) {
    CL.shown = null;
    const c = el("div", {class: "wrap"});
    const bigCheck = svgIcon(ICON_CHECK);
    bigCheck.setAttribute("style", "width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round");
    c.append(head, emptyCard(el("div", {}, bigCheck),
      el("b", {}, "Every loose line of the last two weeks is clarified."), el("br"), el("br"),
      el("button", {class: "btn primary", onclick: () => go("review", {sub: "actions"})}, "On to the next actions ›"), undo));
    return c;
  }
  const r = deck[0], {path, block: b} = r;
  const c = el("div", {class: "wrap wide solwrap clarify"});
  c.append(el("aside", {class: "solside"}, head,
    el("p", {class: "solhow"}, "One line from your day pages at a time, oldest first. Ask: what is it?"),
    el("button", {class: "textbtn", onclick: () => { CL.skip.add(clKey(path, b)); CL.aim = 0; render(); }}, "Skip this line ›"),
    el("button", {class: "textbtn", onclick: () => openBlockAt(V.space, path, b)}, "Open the day page"),
    el("p", {class: "solhow"}, "Keys: the number of an answer, or a letter, aims at it; Enter or the same number again takes it. Backspace undoes.")));
  const kids = (b.children || []).filter(k => trim(plainTitle(k.title || "")) && !isMessage(k));
  // Meeting notes: the heading and what is under it, notes in one go (#366).
  const asked = (b.children || []).filter(k => dayCandidate(k) && !clDealt().has(clKey(path, k)));
  const allNotes = asked.length ? el("button", {class: "btn sm ghost clallnotes",
    onclick: () => clAnswer(r, {label: "Notes, with the " + asked.length + " under it",
      run: (p, line) => asked.forEach(k => clDeal(p, k))})},
    "Leave it and the " + (asked.length === 1 ? "line" : asked.length) + " under it as notes") : null;
  const h3 = el("h3", {translate: "no", html: renderInline(bujoText(b.title))});
  const card = el("div", {class: "clcard"},
    el("div", {class: "cleye"}, dayLong(baseName(path)) +
      (r.trail.length ? " · under “" + r.trail[r.trail.length - 1] + "”" : "")),
    h3, ...clKinds(path, b, h3),
    kids.length ? el("ul", {class: "clkids", translate: "no"}, ...kids.slice(0, 5).map(k =>
      el("li", {html: renderInline(bujoText(k.title))})), kids.length > 5 ? el("li", {}, "…") : null) : null,
    allNotes,
    el("div", {class: "solq"}, el("b", {}, "What is it?")));
  let n = 0;
  const groups = el("div", {class: "clgroups"}, ...CL_GROUPS.map((g, gi) => el("section", {class: "clgroup"},
    el("h4", {}, g),
    ...CL_ANSWERS.filter(a => a.g === gi).map(a => {
      const i = n++;
      return el("button", {class: "clans" + (i === CL.aim ? " on" : ""), title: a.how,
        onmouseenter: () => { CL.aim = i; clPaint(); }, onfocus: () => { CL.aim = i; clPaint(); },
        onclick: () => clAnswer(r, a)},
        el("span", {class: "n"}, String(i + 1)),
        el("span", {class: "lbl"}, el("b", {}, a.label), el("small", {}, a.say)));
    }))));
  c.append(el("div", {class: "sdduel"}, undo, card, groups,
    el("p", {class: "clhow"}, CL_ANSWERS[CL.aim].label + ": " + CL_ANSWERS[CL.aim].how)));
  CL.shown = r;
  return c;
}
