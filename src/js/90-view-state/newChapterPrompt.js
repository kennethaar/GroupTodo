function newChapterPrompt() {
  promptInput({title: "New chapter", label: "Its name", cta: "Add", onSave: v => addBookChapter(v, {make: true})});
}
