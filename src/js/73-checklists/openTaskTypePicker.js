/* A task type to pick for a task, with the starters offered when there is none. */
function openTaskTypePicker(path, block) {
  const types = typeChoices();
  const cur = taskStage(block)?.list || null;
  if (!types.length) { newStateListPrompt(p => setTaskType(path, block, p)); return; }
  const here = V.space;
  listPicker({
    title: "Type of task", typeahead: true,
    items: types.concat(cur ? [null] : []),
    label: t => t ? typeTitle(t) : "No type",
    detail: t => t ? typeStages(t).map(s => s.name).join(" → ")
      + (t.space !== here ? " · from " + t.space : t.path === cur ? " · current" : "") : "back to plain states",
    onPick: t => inSpace(here, () => setTaskType(path, block, t ? typeHere(t) : null)),
    footer: el("button", {class: "btn ghost", onclick: () => { closeModal();
      newStateListPrompt(p => setTaskType(path, block, p)); }}, "+ new type"),
  });
}
