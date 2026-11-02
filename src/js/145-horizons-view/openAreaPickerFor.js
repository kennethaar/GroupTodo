/* Area picker that works for a goal page as well as a project page. */
function openAreaPickerFor(goalPath) {
  const areas = areaList().map(baseName);
  if (!areas.length) { newAreaPrompt(a => { setAreaOfGoal(goalPath, baseName(a)); render(); }); return; }
  listPicker({
    title: "Responsibility for " + pageTitle(goalPath),
    items: areas.concat(["(none)"]),
    label: a => a,
    onPick: a => { setAreaOfGoal(goalPath, a === "(none)" ? null : a); render(); },
  });
}
