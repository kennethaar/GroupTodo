function openAreaPicker(projectPath) {
  const areas = areaList().map(baseName);
  if (!areas.length) { newAreaPrompt(a => { setAreaOfProject(projectPath, baseName(a)); render(); }); return; }
  listPicker({
    title: "Responsibility for " + pageTitle(projectPath),
    items: areas.concat(["(none)"]),
    label: a => a,
    detail: a => a === areaOfProject(projectPath) ? "current" : "",
    onPick: a => { setAreaOfProject(projectPath, a === "(none)" ? null : a); render(); },
    footer: el("button", {class: "btn ghost", onclick: () => { closeModal(); newAreaPrompt(np => { setAreaOfProject(projectPath, baseName(np)); render(); }); }}, "+ new responsibility"),
  });
}
