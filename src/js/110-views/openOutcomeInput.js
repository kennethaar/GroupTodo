/* One box for writing, changing or (left empty) taking off the outcome. */
function openOutcomeInput(path) {
  promptInput({
    title: "Outcome", label: "What does done look like?", value: outcomeOf(path) || "", cta: "Save",
    onSave: v => {
      if (trim(v)) setOutcome(path, trim(v));
      else { delete getPage(path).props.outcome; touch(path); }
      render();
    },
  });
}
