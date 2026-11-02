/* ---------- the project itself ----------
   Written as ordinary markdown a stranger could have typed: a TODO, a verb, a
   link. Opening this file in Notepad shows a list of steps and where each one
   goes, which is the whole promise of keeping tasks as text. */
function seedTourProject() {
  const path = join(DIRS.active, slugify(TOUR_TITLE) + ".md");
  if (V.pages.has(path)) return path;
  const page = projectTemplateLines(slugify(TOUR_TITLE), "1");
  page.props[TOUR_PROP] = "1";
  page.props.outcome = "I have seen every part of GroupToDo and know where my files live";
  const step = title => stampAuthor(newBlock({
    state: "TODO", title, props: {},
  }));
  /* Written without a label -- [[go/todos]] rather than [[go/todos][Todos]] --
     because the link reads out its own destination, so the day one of these
     screens is renamed the task does not go on claiming the old name. */
  page.blocks = [
    step("Find everything you have open in one list - [[go/todos]]"),
    step("Send something to a day instead of today - [[go/agenda]]"),
    step("Say where you are, and see what you can do there - [[go/context]]"),
    step("Give your files a folder, and put your name on your changes - [[go/vault]]"),
    step("Find out who else is here and what they are carrying - [[go/people]]"),
    step("Park a job that comes round again rather than finishing - [[go/checklists]]"),
    step("Read the one screen that keeps the rest trustworthy - [[go/review]]"),
    step("Find anything by typing part of it - [[go/search]]"),
  ];
  putPage(path, page);
  return path;
}
