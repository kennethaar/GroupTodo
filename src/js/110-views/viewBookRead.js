/* ---------- Book › Read (#253) ----------
   The whole book as one text, to read through and mend as you go: each
   chapter's own outline, in Prose, under its name. The same lines as on the
   chapter's page, so a change here is a change there. */
function viewBookRead(c) {
  c.append(vhead(bookName(), null, el("span", {class: "booktoday"}, fmtWords(bookTotal()) + " words"), viewSeg("book")));
  const chapters = bookChapters().filter(ch => ch.path);
  if (!chapters.length) { c.append(emptyCard("No chapter has a page yet. Add one under Chapters.")); return c; }
  c.append(fbar(
    el("button", {class: "textbtn focusbtn", title: "Only the book: no sidebar, no bar (Esc leaves)", onclick: () => setWritingFocus(true)}, "Focus")));
  chapters.forEach((ch, i) => {
    const stage = chapterStage(ch.path);
    c.append(el("div", {class: "readch"},
      el("div", {class: "readhead"},
        el("span", {class: "n"}, String(i + 1)),
        el("button", {class: "nm", title: "Open the chapter", onclick: () => openPage(ch.path)}, pageTitle(ch.path)),
        el("span", {class: "chip bookstage", "data-core": stage.core}, stage.name)),
      inSpace(V.space, () => pageOutline(ch.path, {prose: true, newText: "New paragraph"}))));
  });
  return c;
}
