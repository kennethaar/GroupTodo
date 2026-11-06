function viewDayReview() {
  clSettle();
  const deck = clarifyDeck();
  const head = vhead("Weekly review", deck.length ? deck.length + (deck.length === 1 ? " line" : " lines") + " to clarify" : "Clarify", viewSeg("review"));
  const undo = CL.undo ? el("button", {class: "textbtn", title: "Backspace", onclick: clUndo}, svgIcon(ICON_CHEVRON_LEFT), " Undo the last answer") : null;
  if (!deck.length) {
    CL.shown = null;
    const c = el("div", {class: "wrap"});
    const bigCheck = svgIcon(ICON_CHECK);
    bigCheck.setAttribute("style", "width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round");
    c.append(head, emptyCard(el("div", {}, bigCheck),
      el("b", {}, "Every loose line of the last two weeks is clarified."), el("br"), el("br"),
      el("button", {class: "btn primary", onclick: () => go("review", {sub: "actions"})}, "On to the next actions ›"), " ", undo));
    return c;
  }
  const r = deck[0], {path, block: b} = r;
  const c = el("div", {class: "wrap wide solwrap clarify"});
  c.append(el("aside", {class: "solside"}, head,
    el("p", {class: "solhow"}, "One line from your day pages at a time, oldest first. Ask: what is it?"),
    el("button", {class: "textbtn", onclick: () => { CL.skip.add(clKey(path, b)); CL.aim = 0; render(); }}, "Skip this line ›"),
    undo,
    el("button", {class: "textbtn", onclick: () => openBlockAt(V.space, path, b)}, "Open the day page"),
    el("p", {class: "solhow"}, "Keys: the number of an answer, or a letter, aims at it; Enter or the same number again takes it. Backspace undoes.")));
  const kids = (b.children || []).filter(k => trim(plainTitle(k.title || "")) && !isMessage(k));
  const card = el("div", {class: "clcard"},
    el("div", {class: "cleye"}, dayLong(baseName(path)) +
      (r.trail.length ? " · under “" + r.trail[r.trail.length - 1] + "”" : "")),
    el("h3", {translate: "no", html: renderInline(bujoText(b.title))}),
    kids.length ? el("ul", {class: "clkids", translate: "no"}, ...kids.slice(0, 5).map(k =>
      el("li", {html: renderInline(bujoText(k.title))})), kids.length > 5 ? el("li", {}, "…") : null) : null,
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
  c.append(el("div", {class: "sdduel"}, card, groups,
    el("p", {class: "clhow"}, CL_ANSWERS[CL.aim].label + ": " + CL_ANSWERS[CL.aim].how)));
  CL.shown = r;
  return c;
}
