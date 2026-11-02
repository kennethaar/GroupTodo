function deletePrompt(path) {
  promptInput({
    title: "Delete " + pageTitle(path), label: 'Type YES to confirm', cta: "Delete",
    onSave: ans => {
      if (ans !== "YES") { notify("Delete cancelled"); return; }
      deletePageWithUndo(path);
      go("today");
    },
  });
}
