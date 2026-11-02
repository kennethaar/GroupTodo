function askProjectOutcome(p, land) {
  // A project without a finish line is a wish. Ask straight away.
  promptInput({
    title: "What does done look like?",
    hint: pageTitle(p),
    label: 'State it as if it already happened - "Sink repaired, no drip"',
    value: "", cta: "Create project",
    onSave: outcome => {
      if (trim(outcome)) setOutcome(p, outcome);
      notify("Project created: " + pageTitle(p));
      land();
      render();
      // A project with an outcome but no next action is still stalled.
      setTimeout(() => openAddNextAction(p), 120);
    },
  });
}
