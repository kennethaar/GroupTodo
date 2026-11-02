function newZettelPrompt() {
  promptInput({
    title: "New zettel", label: "Note title", cta: "Create",
    onSave: t => { const p = createZettel(t); notify("Zettel: " + pageTitle(p)); openPage(p); },
  });
}
