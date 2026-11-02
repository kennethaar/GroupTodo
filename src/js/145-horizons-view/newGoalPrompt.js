function newGoalPrompt() {
  promptInput({
    title: "New goal", label: "What do you want true in one to two years?", cta: "Create",
    onSave: t => { const p = createGoal(t); render(); openPage(p); },
  });
}
