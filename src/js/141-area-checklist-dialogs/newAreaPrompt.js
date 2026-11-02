/* ============================================================
   141_AREA + CHECKLIST dialogs
   ============================================================ */
function newAreaPrompt(then) {
  promptInput({
    title: "New responsibility", label: "Something ongoing in this area, not a task (Health, Team, Home)",
    cta: "Create",
    onSave: name => { const p = createArea(name); render(); then ? then(p) : openPage(p); },
  });
}
