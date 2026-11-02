/* Name and folder in one dialog. A page filed in the wrong folder is the same
   errand as a page with the wrong name, so you fix both in one place. The folder
   is what the page is, and a project folder is a status, so moving a page into
   one stamps that status the way the project board does. */
function pageFolderChoices(path) {
  const here = path.split("/").slice(0, -1).join("/");
  const list = [
    [DIRS.active, "Project, active (1/)"], [DIRS.waiting, "Project, waiting for (3/)"],
    [DIRS.someday, "Project, someday/maybe (2/)"], [DIRS.completed, "Project, completed (0/)"],
    [DIRS.cancelled, "Project, cancelled (-/)"],
    [DIRS.areas, "Responsibility (a/)"], [DIRS.goals, "Goal (g/)"],
    [DIRS.people, "Person (p/)"], [DIRS.orgs, "Organisation (o/)"], [DIRS.contexts, "Context (c/)"],
    [DIRS.lists, "Routine or list (8/)"], [DIRS.zettel, "Note (z/)"], [DIRS.mail, "Email (m/)"], [DIRS.reviews, "Review (r/)"], [DIRS.pages, "Other page (pages/)"],
  ];
  if (!list.some(([d]) => d === here))
    list.unshift([here, "Where it is now (" + here.replace(/^pages\/?/, "") + "/)"]);
  return list;
}
