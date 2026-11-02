function newContextPrompt(onPick) {
  promptInput({
    title: "New context", label: "Name (no @, e.g. phone, errand, home/kitchen)",
    cta: "Create",
    onSave: name => {
      const clean = makeContext(name);
      notify("Context created: @" + clean);
      render();
      if (onPick) onPick(clean);
    },
  });
}
