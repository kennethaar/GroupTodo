function newScenePrompt(path) {
  promptInput({title: "New scene in " + pageTitle(path), label: "Its name", cta: "Add", onSave: v => {
    const first = addScene(path, v);
    if (!first) return;
    openPage(path);
    focusBlock(first.id);
  }});
}
