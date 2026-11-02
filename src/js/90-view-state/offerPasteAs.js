function offerPasteAs(raw, ask, swap) {
  const mail = parseEmailText(raw), kindle = parseKindleNotes(raw);
  const t = el("div", {class: "toast pasteas"});
  let timer = 0;
  const close = () => { clearTimeout(timer); t.remove(); };
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
    // Kindle's notes are a book's; anything else is asked what it was.
    ["review", "Review", () => kindle ? review("book") : pickMedium()],
  ];
  const first = mail ? "email" : kindle ? "review" : "note";
  choices.sort((a, b) => (b[0] === first) - (a[0] === first));
  row(ask, choices.map(([, label, run]) => [label, run]));
  $("#toasts").append(t);
  wait();
}
