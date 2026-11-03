function guideText(dir, code, name, about) {
  const folders = GUIDE_FOLDERS.filter(([d]) => d.startsWith(PAGES + "/"))
    .map(([d, c, n]) => "- " + d.slice(PAGES.length + 1) + "/  " + n);
  return [
    "<!-- Written by GroupToDo, guide " + GUIDE_VERSION + ". GroupToDo rewrites this file when the guide changes, so edits here do not last. It is never read as a page. -->",
    "",
    "# " + (code === "GroupToDo" ? "How this folder works" : (dir || "this folder") + "/ is for " + name),
    "",
    about,
    "",
    "## How the folders work",
    "",
    "Every task and note is plain text in a .md file, so any of them opens in Notepad. " +
      "What a page is depends on the folder it is in, and the folder name is also the start of a link: " +
      "[[o/Acme]] is pages/o/Acme.md. Move a page to another folder and it becomes that kind of page, " +
      "and GroupToDo rewrites every link to it. A project's status is its folder, so moving it from 1/ to 0/ " +
      "is what marks it completed.",
    "",
    ...folders,
    "",
    "Fix a page in the wrong folder from the ... beside its title: Rename lets you change the name and the folder in one go.",
    "",
    "## Linking as you type",
    "",
    "- Start typing a name you have used before, a person, an organisation or a project, and GroupToDo offers it. Enter takes it and makes it a link.",
    "- A full name typed out is linked by itself when you leave the line, and so is a first name nobody else has.",
    "- @ lists contexts, # lists projects, [[ lists every page. People come up as you type their name.",
    "- Dates are words: tomorrow, friday, next week, end of month, in 3 days, 15 oct. Tab makes it the due date, " +
      "and a date at the end of a task becomes its due date when you leave the line.",
    "- #anything that is not a project is a tag of your own, #urgent or #invoice. The boards in Next and Waiting for can show one column per tag.",
    "- A task that links a person, \"ask [[p/Alexander Bee]] about the pollen\", stays yours and shows up in Waiting for under that person, to ask them about.",
    "",
    "## Inside a file",
    "",
    "    title:: Fix the sink",
    "    status:: 1 = active",
    "",
    "    - TODO Call the plumber about the leak [[c/phone]] #urgent",
    "      DEADLINE:: [[2026-10-15]]",
    "      assigned:: Alice Berg",
    "",
    "Lines with key:: value are values. A line starting with TODO, DOING, WAIT, DONE or CANCELLED is a task. " +
      "assigned:: hands a task to somebody; without it, the task belongs to whoever wrote it.",
    "",
  ].join("\n");
}
