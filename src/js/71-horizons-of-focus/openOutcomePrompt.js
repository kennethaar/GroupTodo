function openOutcomePrompt(path, then) {
  promptInput({
    title: "What does done look like?",
    hint: pageTitle(path),
    note: projectProvenance(path),
    label: 'Write it as if it already happened - "Sink repaired, no drip"',
    value: outcomeOf(path) || "",
    cta: "Save outcome", suggest: true,
    onSave: text => { setOutcome(path, text); render(); if (then) then(); },
  });
}
