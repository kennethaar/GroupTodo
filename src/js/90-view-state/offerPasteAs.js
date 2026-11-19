/* After a long paste: make a page of the lines instead, or keep them. plan,
   when given, opens Plan it with an AI on the pasted lines (#449): an email
   or a chat thread is often a project waiting to be clarified. at, the id of
   the last pasted line, puts the offer under the lines, where the eyes are,
   rather than in the corner; outlineBlock puts it back after a redraw. */
function offerPasteAs(raw, ask, swap, plan, at) {
  const mail = parseEmailText(raw);
  const t = el("div", {class: "toast pasteas", role: "group", "aria-label": "What the pasted lines become"});
  let timer = 0;
  const close = () => {
    clearTimeout(timer); t.remove();
    if (PASTE_OFFER.el === t) Object.assign(PASTE_OFFER, {id: null, el: null});
  };
  const wait = () => { clearTimeout(timer); timer = setTimeout(close, 20000); };
  const make = (kind, prefix, save, what) => {
    close();
    const saved = save();
    const undo = swap(kind, "[[" + prefix + "/" + saved.name + "]]");
    if (!undo) {
      for (const p of saved.made) removePage(p);
      notify("The pasted lines have moved, so they were left as they are.", "warn");
      return;
    }
    notify("Saved as " + what + "; the line links to it.", "info", {
      label: "Keep the lines",
      run: () => {
        if (!undo()) { notify("The link has moved, so it was left as it is.", "warn"); return; }
        for (const p of saved.made) removePage(p);
      },
    });
  };
  const row = (words, buttons) => {
    t.replaceChildren(el("span", {}, words),
      ...buttons.map(([label, run]) => el("button", {class: "act", onclick: run}, label)),
      el("button", {class: "act", onclick: close}, "Keep as lines"));
  };
  const review = medium => make("review", "r", () => saveReviewPage(raw, medium), "a review");
  const pickMedium = () => { wait(); row("A review of a", REVIEW_MEDIA.map(([m, label]) => [label, () => review(m)])); };
  const choices = [
    ["email", "Email page", () => make("email", "m", () => saveEmailPage(mail || mailFromLines(raw)), "an email page")],
    ["note", "Note", () => make("note", "z", () => saveNotePage(raw), "a note")],
    ["review", "Review", pickMedium],
  ];
  const first = mail ? "email" : "note";
  choices.sort((a, b) => (b[0] === first) - (a[0] === first));
  const buttons = choices.map(([, label, run]) => [label, run]);
  if (plan) buttons.push(["Plan it with an AI", () => { close(); plan(); }]);
  row(ask, buttons);
  // One offer at a time: a new paste replaces the last one's.
  if (PASTE_OFFER.el) PASTE_OFFER.el.remove();
  Object.assign(PASTE_OFFER, {id: null, el: null});
  const under = at && document.querySelector('.blk[data-id="' + at + '"]');
  if (under) {
    t.classList.add("inline");
    // A click on the offer is not a click on the line around it.
    for (const ev of ["mousedown", "pointerdown", "click"]) t.addEventListener(ev, e => e.stopPropagation());
    Object.assign(PASTE_OFFER, {id: at, el: t});
    under.append(t);
    // Lined up with the words of the line, as the title offer is (#415).
    const words = under.querySelector(":scope > .line > .txt");
    if (words) t.style.marginLeft = Math.max(0, words.getBoundingClientRect().left - under.getBoundingClientRect().left) + "px";
  }
  else $("#toasts").append(t);
  wait();
}
