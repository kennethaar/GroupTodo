function checklistKindFact(path) {
  if (isStateList(path)) return {
    key: "kind", raw: "kind:: states",
    save: () => {},
    pills: () => [factPill("task type", "fok", "each line is a stage: Name (waiting), (doing), (done)",
      () => notify("Each line is a stage. Put (to do), (doing), (waiting), (done) or (cancelled) after it to say what it counts as."))],
  };
  const said = v => { const m = /::\s*([\s\S]*)$/.exec(v); return trim(m ? m[1] : v).toLowerCase(); };
  if (isWordList(path)) return {
    key: "kind", raw: "kind:: words",
    save: v => setChecklistKind(path, ["project", "words"].includes(said(v)) ? said(v) : null),
    pills: () => [factPill("word list", "fok", "offered on " + (trim(getPage(path).props.lines || "") || "=") + " lines",
      () => notify("Each line is a word, with the closer words under it. lines:: says which lines offer them, = for feelings."))],
  };
  const tpl = isProjectTemplate(path);
  return {
    key: "kind", raw: "kind:: " + (tpl ? "project" : ""),
    save: v => setChecklistKind(path, ["project", "words"].includes(said(v)) ? said(v) : null),
    pills: () => [factPill(tpl ? "project template" : "simple checklist", tpl ? "fok" : "fquiet",
      tpl ? "every run spins up a whole project" : "steps you tick off in place",
      () => chipMenu(tpl ? "Project template" : "Simple checklist", "what running this does", [
        ["a", tpl ? "Run it into a new project" : "Add it to a page", null, () => openRunChecklist(path)],
        ["b", tpl ? "Make it a simple checklist" : "Make it a project template", null,
          () => { setChecklistKind(path, tpl ? null : "project"); render(); }],
        tpl ? null : ["c", "Make it a word list", "words to pick on = lines", () => { setChecklistKind(path, "words"); render(); }],
      ].filter(Boolean)))],
  };
}
