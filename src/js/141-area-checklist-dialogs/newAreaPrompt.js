/* ============================================================
   141_AREA + CHECKLIST dialogs
   ============================================================ */
function newAreaPrompt(then) {
  // Made in the area it was asked in, even if another one shows by the time it is saved.
  const sp = V.space;
  promptInput({
    title: "New responsibility", label: "Something ongoing in this area, not a task (Health, Team, Home)",
    cta: "Create",
    onSave: name => { const p = inSpace(sp, () => createArea(name)); render(); then ? then(p) : openPage(p); },
  });
}
