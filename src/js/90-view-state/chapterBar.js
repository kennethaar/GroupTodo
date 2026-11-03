/* The bar over a chapter: how to see it, and today's words. */
function chapterBar(path) {
  const book = bookOfChapter(path) || bookPath();
  const prose = bookMode() === "prose", daily = bookDaily(book), today = bookToday(book);
  const setMode = m => { PREF.set("book.mode", m); render(); };
  return el("div", {class: "fbar chapterbar"},
    el("div", {class: "vseg", role: "group", "aria-label": "Show the chapter as"},
      ...[["outline", "Outline"], ["prose", "Prose"]].map(([k, label]) =>
        el("button", {"aria-pressed": String(bookMode() === k), title: k === "prose" ? "Paragraphs, no bullets" : "Lines and bullets",
          onclick: () => setMode(k)}, label))),
    prose ? fchip("Beats", !beatsHidden(), () => { PREF.set("book.beats", beatsHidden() ? "show" : "hide"); render(); }) : null,
    el("button", {class: "textbtn scriptbtn", title: "Write talk fast, a line per speaker, at the end of the chapter (/script on a line puts it there)",
      onclick: () => openScript({path})}, "Script"),
    el("button", {class: "textbtn focusbtn", title: "Only the page: no sidebar, no bar (Esc leaves)", onclick: () => setWritingFocus(true)}, "Focus"),
    el("span", {class: "booktoday", title: daily ? "Today, against your goal a day" : "Words written today"},
      daily ? el("span", {class: "pbar"}, el("i", {style: "width:" + Math.min(100, Math.round(100 * today / daily)) + "%"})) : null,
      el("span", {class: "ratio"}, fmtWords(today) + (daily ? " of " + fmtWords(daily) : "") + " today")));
}
