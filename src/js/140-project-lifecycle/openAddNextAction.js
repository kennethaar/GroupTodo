function openAddNextAction(path) {
  promptInput({
    title: "Next action",
    hint: pageTitle(path),
    note: projectProvenance(path),
    label: "What is the very next physical action?",
    // An example, not a start: a word already in the box has to be deleted first.
    placeholder: "Call Anna about the quote", cta: "Add", suggest: true,
    onSave: text => {
      const blk = addNextActionTo(path, text);
      render();
      if (!startsWithVerb(text)) { openVerbPicker(path, blk); return; }
      if (!hasContextLink(text)) promptAndInsertContext(path, blk);
    },
  });
}
