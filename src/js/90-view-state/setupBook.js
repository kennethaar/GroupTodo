/* A new book in 8/book/, and the area set up for it: a Chapter type for its
   stages, the templates for a place and a thing, and a Words tracker on every
   day. What is there already is left as it is. Joining books already there,
   it goes last in the series, and the series is numbered so it stays so. */
function setupBook(info = {}) {
  const chapter = createStateList("Chapter", BOOK_STAGES.map((s, i) => s + " (" + CORE_WORD[byPlace(BOOK_STAGES)[i].core] + ")"));
  const about = {title: oneLine(info.name) || "book"}, before = bookPaths();
  for (const k of ["subtitle", "synopsis"]) if (oneLine(info[k])) about[k] = oneLine(info[k]);
  const stem = join(BOOK_DIR, slugify(oneLine(info.name) || "Book"));
  let path = stem + ".md";
  for (let n = 2; V.pages.has(path); n++) path = stem + " " + n + ".md";
  if (before.length) {
    before.forEach((p, i) => { if (String(getPage(p).props.order || "") !== String(i + 1)) { getPage(p).props.order = String(i + 1); touch(p); } });
    about.order = String(before.length + 1);
  }
  putPage(path, {props: {...about, created: todayStamp(), target: "80000",
    stages: "[[" + pageRef(chapter) + "]]"}, blocks: []});
  PREF.set(curBookKey(), path);
  for (const [name, t] of Object.entries(BOOK_TEMPLATES))
    if (!readTemplate(name)) putPage(join(DIRS.lists, name + ".md"), {props: {...t.props}, blocks: t.lines.map(title => newBlock({title}, false))});
  const year = getPage(join(DIRS.lists, todayISO().slice(0, 4) + ".md"));
  if (!year || !pageHasTracker(year, "words")) scheduleTracker(parseTracker("tracker-words_n::"), {mode: "daily"}, todayISO());
  clearMemo();
  render();
  notify(before.length ? about.title + " is book " + about.order + " here. Add the first chapter." : "Book is in the sidebar. Add the first chapter there.");
}
