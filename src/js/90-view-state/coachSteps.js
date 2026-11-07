function coachSteps() {
  const onDisk = V.backend && (V.backend.kind === "fs" || V.backend.kind === "http");
  /* Who, then where, then what -- the same three questions the welcome screen
     asks, in the same order, so coming back to one of them is not a new idea.
     Crossing something off your own list is not a lesson anybody needs taught,
     so the third step ends at "added" and the strip itself is what gets ticked. */
  const steps = [
    {k: "who", done: coachDone("who") || hasFullName(whoAmI()), auto: hasFullName(whoAmI()),
     label: "Who are you", cta: "Add name", redo: "Change name",
     hint: hasFullName(whoAmI()) ? "" : "your full name",
     why: "Your name goes on what you add and what you close. Two people called Kenneth is " +
          "the day you wish you had typed the surname.",
     act: () => promptInput({
       title: "Your name", value: whoAmI(), cta: "Save", label: "Full name",
       onSave: n => { setIdentity(n, Spaces.active); coachMark("who"); render(); },
     })},
    {k: "where", done: coachDone("where") || onDisk, auto: onDisk,
     label: "Where the files live", cta: "Choose folder", redo: "Change folder",
     hint: onDisk ? "" : "right now they live in this browser only",
     why: "Pick a folder and they become plain .md files there. Share the folder to share the list.",
     act: () => openSpaceStorageSetup()},
    {k: "add", done: coachDone("add"), label: "Add your first task",
     hint: "type it in the box at the top and press Enter",
     why: "Getting it out of your head and into GroupToDo. The system will grow with your needs."},
  ];
  /* Once there is a task, the payoff: Next, where you pick what to do. Opening
     Next ticks it, so it is never a lesson in ticking (UX-002). */
  if (coachDone("add"))
    steps.push({k: "next", done: coachDone("next"), label: "Pick your next action", cta: "Open Next",
      hint: "Next lists what you can do now, by context",
      why: "This is where the list pays off. Pick what fits where you are and what time you have.",
      act: () => go("next")});
  /* Filing waits until there is something to file. */
  if (coachDone("add")) {
    // The tour project was put there by the app, so it cannot stand in for one
    // of your own -- this step is about filing a job of your own.
    const own = projectsIn("1").filter(p => !isTourProject(p));
    steps.push({k: "project", done: own.length > 0 || coachDone("project"), auto: own.length > 0, optional: true,
      label: "Give a bigger job a project", cta: "Make one", redo: "Make another",
      hint: "anything that needs more than one step",
      why: "A task is one move. A project is the moves that finish something, plus a line " +
           "saying what done looks like.",
      act: () => newProjectPrompt()});
  }
  /* The one pointer at the tour. Without it the first project sits in Active
     where a newcomer has no reason to look. */
  const tourPath = tourProjectPath();
  const tourLeft = tourPath ? tourSteps(tourPath).filter(s => s.open).length : 0;
  if (tourPath && coachDone("add")) {
    steps.push({k: "tour", done: tourLeft === 0 || coachDone("tour"), auto: tourLeft === 0, optional: true,
      label: "Find your way round the rest of it", cta: "Open",
      hint: tourLeft ? tourLeft + " steps, each a link to the part it is about" : "",
      why: "Contexts, dates, people, routines, your folder. Each step is a task on your list: " +
           "reorder it, reword it or delete the lot.",
      act: () => openPage(tourPath)});
  }
  return steps;
}
