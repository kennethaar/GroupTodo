function viewBook() {
  const c = el("div", {class: "wrap"});
  const books = bookList();
  if (books.length > 1) c.append(bookTabs(books));
  if (!hasBook()) {
    c.append(vhead("Book", "Chapters, their stages and a word goal"),
      el("div", {class: "card", style: "padding:16px"}, el("p", {}, "No book in this area yet."),
        el("button", {class: "btn primary", onclick: () => openBookInfo({create: true})}, "Set up for writing a book")));
    return c;
  }
  const sub = subNow();
  if (sub === "cast") return viewBookCast(c);
  if (sub === "relations") return viewBookRelations(c);
  if (sub === "timeline") return viewBookTimeline(c);
  if (sub === "plot") return viewBookPlot(c);
  if (sub === "read") return viewBookRead(c);
  if (sub === "revise") return viewBookRevise(c);
  const rows = bookChapters().map(ch => Object.assign(ch, ch.path ? {words: chapterWords(ch.path), stage: chapterStage(ch.path)} : {words: 0, stage: null}));
  const total = rows.reduce((n, r) => n + r.words, 0), target = bookTarget();
  const done = rows.filter(r => r.stage && r.stage.core === "DONE").length;
  const info = bookInfo();
  c.append(vhead(bookName(), null,
    newBtn("chapter", newChapterPrompt),
    el("button", {class: "textbtn bookedit", title: "Name, subtitle and synopsis", onclick: () => openBookInfo()}, "Edit"),
    rows.length ? el("button", {class: "textbtn bookexport", title: "The whole book as one markdown file", onclick: exportBook}, "Export") : null,
    darlings().length ? el("button", {class: "textbtn bookdarlings", title: "What you cut, kept to put back", onclick: () => openPutBack(DARLINGS_PATH)},
      "Darlings " + darlings().length) : null,
    viewSeg("book")));
  if (info.subtitle) c.append(el("div", {class: "booksub"}, info.subtitle));
  if (info.synopsis) c.append(el("p", {class: "booksyn"}, info.synopsis));
  if (!rows.length) {
    c.append(el("div", {class: "card", style: "padding:16px"}, el("p", {}, "No chapters yet."),
      el("button", {class: "btn primary", onclick: openAddChapter}, "+ Add a chapter")));
    return c;
  }
  const pct = target ? Math.min(100, Math.round(100 * total / target)) : Math.round(100 * done / rows.length);
  c.append(el("div", {class: "card bookgoal"},
    el("span", {class: "pbar"}, el("i", {style: "width:" + pct + "%"})),
    el("span", {class: "ratio"}, fmtWords(total) + (target ? " of " + fmtWords(target) : "") + " words · ",
      done + "/" + rows.length + " chapters done · " + fmtWords(bookToday()) + (bookDaily() ? " of " + fmtWords(bookDaily()) : "") + " today" +
      (darlingWords() ? " · " + fmtWords(darlingWords()) + " cut" : ""))));
  const list = el("div", {class: "card booklist"});
  rows.forEach((r, i) => {
    const syn = r.path ? chapterSynopsis(r.path) : "";
    list.append(bookChapterRow(el("div", {class: "prow bookch"},
      el("span", {class: "n"}, String(i + 1)),
      el("div", {class: "bookch-main"},
        el("button", {class: "nm", title: r.path ? "Write in it" : "Make the page", onclick: () => r.path ? openPage(r.path) : openLinkTarget(r.name)},
          r.path ? pageTitle(r.path) : r.name),
        r.path ? el("button", {class: "chsyn" + (syn ? "" : " add"), title: syn ? "Change the synopsis" : "What happens in it",
          onclick: () => editChapterSynopsis(r.path)}, syn || "+ synopsis") : null,
        r.path ? bookSceneList(r.path) : null),
      r.stage ? el("button", {class: "chip bookstage", "data-core": r.stage.core, title: "Where it is. Click to move it on.",
        onclick: () => pickChapterStage(r.path)}, r.stage.name) : el("span", {class: "sub"}, "no page yet"),
      el("span", {class: "wc"}, fmtWords(r.words)),
      el("button", {class: "chcut", title: "Cut it to your darlings: out of the book, kept to put back", "aria-label": "Cut " + r.name + " to the darlings",
        onclick: () => cutChapterToDarlings(i)}, "✂")), i, r.name));
  });
  c.append(list);
  return c;
}
