/* Running a project template: name it, confirm the outcome, get a real project.
   onMade, when given, is told instead of the project being opened. */
function runTemplateAsProject(listPath, onMade) {
  const tpl = getPage(listPath);
  const steps = flattenBlocks(tpl.blocks).length;
  const nameInput = el("input", {placeholder: "Acme Ltd"});
  const outcomeInput = el("input", {});
  const sync = () => {
    const n = trim(nameInput.value) || "%name%";
    outcomeInput.value = expandVars(trim(tpl.props?.outcome || "%name% complete"), {name: n, project: n});
  };
  nameInput.addEventListener("input", sync);
  sync();
  modal({
    center: true, title: "New project from " + pageTitle(listPath), hint: steps + " steps",
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "Project name"), nameInput,
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "Replaces %name% in every step.")),
      el("div", {class: "field"}, el("label", {}, "What does done look like?"), outcomeInput)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => {
        const name = trim(nameInput.value);
        if (!name) return;
        closeModal();
        const made = runChecklistAsProject(listPath, name, {outcome: outcomeInput.value});
        if (!made) return;
        if (onMade) { onMade(made); return; }
        notify("Project created with " + made.steps + " steps.");
        openPage(made.path);
      }}, "Create project"),
    ],
  });
  setTimeout(() => nameInput.focus(), 30);
}
