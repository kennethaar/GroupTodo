function openRunHere(path, b) {
  const group = pth => RUN_GROUPS.findIndex(([, test]) => test(pth));
  // The templates a new person, project or day page is made from are not lists you run.
  const kindTpls = new Set(Object.keys(TEMPLATE_DEFAULTS).concat(["0", "2", "3", "-"]).map(readTemplate).filter(Boolean));
  const items = checklistPages()
    .filter(pth => !isStateList(pth) && !isWordList(pth) && !kindTpls.has(pth) && pth !== REVIEW_LIST_PATH && pth !== ASK_OWN_PATH && pth !== INFORM_OWN_PATH)
    .sort((x, y) => group(x) - group(y) || pageTitle(x).localeCompare(pageTitle(y)));
  if (!items.length) { notify("No checklists yet. Make one in Settings."); return; }
  listPicker({
    title: "Run which checklist here?", typeahead: true, items,
    label: pth => pageTitle(pth),
    // The same chip as in Settings: its rhythm, or what its run makes.
    detail: pth => isProjectTemplate(pth) ? "new project" : routineSummary(pth),
    onPick: pth => {
      if (!isProjectTemplate(pth)) { runListUnder(path, b, pth); return; }
      runTemplateAsProject(pth, made => {
        if (getPage(path)) insertMakeLink(path, b, linkRefTo(made.path));
        notify("Project created with " + made.steps + " steps.", "info",
          {label: "open", run: () => openPage(made.path)});
      });
    },
  });
}
