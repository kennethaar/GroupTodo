/* The steps from one app to GroupToDo (#458), with the importer to download.
   An export in the app comes first, then the importer is opened. */
function openMigrateSteps(app) {
  const [, own] = MIGRATE_APPS.find(([name]) => name === app) || MIGRATE_APPS[0];
  const exported = own.length > 1 ? [own[0]] : [];
  const steps = [...exported, MIGRATE_FOLDER_STEPS[0], own.at(-1), ...MIGRATE_FOLDER_STEPS.slice(1)];
  modal({
    center: true, title: "Bring your notes from " + app,
    body: el("div", {class: "migsteps"},
      el("ol", {}, ...steps.map(s => el("li", {}, s))),
      el("a", {class: "btn primary", href: MIGRATE_IMPORTER, download: MIGRATE_IMPORTER}, "Download the importer")),
    foot: [el("div", {style: "flex:1"}), el("button", {class: "btn ghost", onclick: closeModal}, "Close")],
  });
}
