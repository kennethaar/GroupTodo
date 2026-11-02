/* ============================================================
   140_PROJECT LIFECYCLE
   Port of: init.lua 65_PROJECT_STATUS_MOVE + project_completion_prompt
   ============================================================ */
function openStatusPicker(path) {
  const codes = STATUS_ORDER;
  listPicker({
    title: "Project status: " + pageTitle(path),
    items: codes,
    label: c => STATUS_LABEL[c],
    detail: c => statusDirOf(path) === c ? "current" : "",
    onPick: c => setProjectStatus(path, c),
    footer: el("button", {class: "btn ghost", onclick: () => { closeModal(); openProjectHold(path); }},
      projectHold(path) === HOLD_OPEN ? "On hold, no date…"
        : projectHold(path) ? "On hold until " + humanDate(projectHold(path)) + "…" : "Hold until a day…"),
  });
}
