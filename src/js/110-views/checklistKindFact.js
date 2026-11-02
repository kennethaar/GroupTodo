function checklistKindFact(path) {
  if (isStateList(path)) return {
    key: "kind", raw: "kind:: states",
    save: () => {},
    pills: () => [factPill("task type", "fok", "each line is a stage: Name (waiting), (doing), (done)",
      () => notify("Each line is a stage. Put (to do), (doing), (waiting), (done) or (cancelled) after it to say what it counts as."))],
  };
  const tpl = isProjectTemplate(path);
  return {
    key: "kind", raw: "kind:: " + (tpl ? "project" : ""),
    save: v => {
      const m = /::\s*([\s\S]*)$/.exec(v);
      const text = trim(m ? m[1] : v).toLowerCase();
      setChecklistKind(path, text === "project" ? "project" : null);
    },
    pills: () => [factPill(tpl ? "project template" : "simple checklist", tpl ? "fok" : "fquiet",
      tpl ? "every run spins up a whole project" : "steps you tick off in place",
      () => chipMenu(tpl ? "Project template" : "Simple checklist", "what running this does", [
        ["a", tpl ? "Run it into a new project" : "Add it to a page", null, () => openRunChecklist(path)],
        ["b", tpl ? "Make it a simple checklist" : "Make it a project template", null,
          () => { setChecklistKind(path, tpl ? null : "project"); render(); }],
      ]))],
  };
}
