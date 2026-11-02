/* value: the line it is made from, so its words are there to keep or change. */
function newProjectPrompt(then, value = "") {
  promptInput({
    title: "New project", label: "Project name", cta: "Next", value,
    onSave: name => {
      if (ROUTINE_WORDS.test(name)) routineFork(name, then);
      else createProjectFlow(name, then);
    },
  });
}
