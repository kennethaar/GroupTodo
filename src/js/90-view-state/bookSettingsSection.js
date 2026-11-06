/* ---------- Settings > Book (#240) ----------
   Before there is a book, one button sets the area up for it. After, the goal
   and the stages are picked, the chapters move with ↑ ↓ and leave with ×.
   Written to the book's page in 8/, so it goes with the area. With more than
   one book, which one, and its place in the series. Focus stays on the
   button pressed, or the one that took its place. */
function bookSettingsSection() {
  const card = el("div", {class: "card bookset"},
    el("div", {class: "listblurb"}, "Chapters in order, the stages they go through and a word goal. For everyone in this area, in " +
      bookPath().replace(PAGES + "/", "") + "."));
  if (!hasBook()) {
    card.append(el("div", {class: "helpsee"}, el("button", {class: "btn sm", onclick: () => openBookInfo({create: true})}, "Set up for writing a book")));
    return section("Book", null, card);
  }
  const head = t => el("div", {class: "bookset-h"}, t);
  const books = bookPaths(), cur = bookPath();
  if (books.length > 1) {
    card.append(head("Book"), el("div", {class: "bookset-row bookpick"},
      segPicker(books.map(p => ({key: p, label: bookName(p)})), cur, k => setCurrentBook(k))));
    card.append(head("Place in the series"), el("div", {class: "bookset-row bookorder"},
      segPicker(books.map((_, i) => ({key: String(i), label: String(i + 1)})), String(books.indexOf(cur)), k => setBookOrder(cur, +k))));
  }
  const info = bookInfo();
  card.append(head("Title"), el("div", {class: "prow"},
    el("span", {class: "nm"}, bookName()), info.subtitle ? el("span", {class: "sub"}, info.subtitle) : null,
    el("button", {class: "btn sm ghost bookrename", onclick: () => openBookInfo()}, "Change")));
  const target = bookTarget();
  const goals = [0, ...BOOK_GOALS, ...(target && !BOOK_GOALS.includes(target) ? [target] : [])]
    .map(n => ({key: String(n), label: n ? fmtWords(n) : "None"}));
  card.append(head("Word goal"), el("div", {class: "bookset-row"},
    segPicker(goals, String(target || 0), k => setBookTarget(+k))));
  const daily = bookDaily();
  const days = [0, ...BOOK_DAILY, ...(daily && !BOOK_DAILY.includes(daily) ? [daily] : [])]
    .map(n => ({key: String(n), label: n ? fmtWords(n) : "None"}));
  card.append(head("Words a day"), el("div", {class: "bookset-row bookdaily"},
    segPicker(days, String(daily || 0), k => setBookDaily(+k))));
  const style = dialogueStyle();
  card.append(head("Dialogue"), el("div", {class: "bookset-row bookdialogue"},
    segPicker([{key: "", label: "As typed"}, ...Object.entries(DIALOGUE).map(([key, d]) => ({key, label: d.label}))],
      style || "", k => setDialogueStyle(k)),
    style ? el("button", {class: "textbtn booktidy", title: "Set the quotes and dashes already written in this style",
      onclick: tidyBook}, "Tidy the book") : null));
  // The built-in stages, then every task type here; one written by hand as names shows as it is.
  const list = bookStageList(), said = trim(String(bookProps().stages || ""));
  const chain = stages => stages.map(s => s.name).join(" → ") + ". The last one is done: that is how a chapter is finished.";
  const kinds = [{key: "", label: "Built in", blurb: chain(byPlace(BOOK_STAGES))},
    ...stateLists().map(p => ({key: p, label: pageTitle(p), blurb: chain(stagesOf(p))}))];
  const own = !list && said && bookStages().length >= 2 ? "own" : null;
  if (own) kinds.push({key: own, label: "As written", blurb: chain(bookStages())});
  card.append(head("Stages"), el("div", {class: "bookset-row"},
    segPicker(kinds, list || own || "", k => k !== "own" && setBookStages(k))));
  const chapters = bookChapters();
  const refocus = (name, sel) => requestAnimationFrame(() => {
    const row = [...document.querySelectorAll(".bookset .prow")].find(r => r.dataset.ch === name);
    const b = (row && (row.querySelector(sel) || row.querySelector("button:not([disabled])"))) || document.querySelector(".bookset .bookadd");
    if (b) b.focus();
  });
  card.append(head("Chapters"));
  chapters.forEach((ch, i) => {
    const arrow = (d, sym, word) => el("button", {class: "btn sm ghost", "data-dir": String(d),
      "aria-label": "Move " + ch.name + " " + word, title: "Move " + word,
      disabled: (d < 0 ? i === 0 : i === chapters.length - 1) ? "" : null,
      onclick: () => { moveBookChapter(i, d); refocus(ch.name, '[data-dir="' + d + '"]:not([disabled])'); }}, sym);
    const row = el("div", {class: "prow"},
      el("span", {class: "nm"}, (i + 1) + ". " + (ch.path ? pageTitle(ch.path) : ch.name)),
      el("span", {class: "sub"}, ch.path ? chapterStage(ch.path).name : "no page yet"),
      arrow(-1, svgIcon(ICON_ARROW_UP), "up"), arrow(1, svgIcon(ICON_ARROW_DOWN), "down"),
      el("button", {class: "btn sm ghost", "aria-label": "Take " + ch.name + " out of the book", title: "Out of the book (the page stays)",
        onclick: () => { dropBookChapter(i); const next = chapters[i + 1] || chapters[i - 1]; refocus(next ? next.name : "", "[data-drop]"); }}, "×"));
    row.lastChild.dataset.drop = "";
    row.dataset.ch = ch.name;
    card.append(row);
  });
  card.append(el("div", {class: "helpsee"},
    el("button", {class: "textbtn bookadd", onclick: openAddChapter}, "+ Add a chapter"),
    el("button", {class: "textbtn", title: "In this area, sharing its people, places and things, or in another", onclick: () => openBookInfo({create: true})}, "+ New book"),
    el("button", {class: "textbtn", onclick: bookDefault}, "Back to the default")));
  return section("Book", null, card);
}
