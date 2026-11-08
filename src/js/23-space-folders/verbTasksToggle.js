/* An area's switch for day-page lines that start with a verb (#326). Kept in
   the area's GTD.md, so everyone in the folder writes the same way. Shown only
   once the area is loaded: before that there is no GTD.md to keep it in. */
function verbTasksToggle(space) {
  if (!LOADED.has(space)) return null;
  const read = () => inSpace(space, () => trim(String(getPage(SETTINGS_PATH)?.props?.verb_tasks || "")).toLowerCase());
  const box = el("input", {type: "checkbox"});
  box.checked = ["on", "yes", "true"].includes(read());
  box.addEventListener("change", () => inSpace(space, () => {
    if (box.checked) setSetting("verb_tasks", "on");
    else { delete settingsPage().props.verb_tasks; touch(SETTINGS_PATH); }
  }));
  return el("label", {class: "afverb", title: "Call Bob becomes a to do. Keep as note in the toast undoes it."},
    box, " Lines that start with a verb become to dos");
}
