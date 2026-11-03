function cutChapterToDarlings(i) {
  const ch = bookChapters()[i];
  if (!ch) return;
  dropBookChapter(i);
  const kept = newBlock({title: "[[" + (ch.path ? pageRef(ch.path) : ch.name) + "]]"}, false);
  keepDarling(kept, {chapter: String(i + 1), cut: todayISO()});
  darlingCut(kept, "The chapter");
}
