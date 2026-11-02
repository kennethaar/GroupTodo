/* Any page can be poured into any page, so the picker offers every page there
   is rather than today and the live projects alone -- a template for a person
   page or an org page was impossible to use before, which is most of why the
   two folders stayed separate. Today stays first, because it usually is. */
function openRunChecklist(listPath) {
  if (isProjectTemplate(listPath)) { runTemplateAsProject(listPath); return; }
  const todos = stencilMakesTodos(listPath);
  const today = ensureJournal(todayISO());
  const seen = new Set([today, listPath]);
  const targets = [{label: "Today", path: today}];
  const offer = (path, label) => {
    if (seen.has(path)) return;
    seen.add(path);
    targets.push({label, path});
  };
  for (const pth of [...projectsIn("1"), ...projectsIn("3")]) offer(pth, pageTitle(pth));
  for (const pth of allPages(q => !isStencilPath(q))) offer(pth, pageRef(pth) + "  \u00b7  " + pageTitle(pth));
  listPicker({
    title: "Add " + pageTitle(listPath) + " to",
    items: targets,
    label: t => t.label,
    onPick: t => {
      const got = applyStencil(listPath, t.path);
      const bits = [];
      if (got.lines) bits.push(got.lines + " " + (todos ? "step" : "line") + (got.lines === 1 ? "" : "s"));
      if (got.fields) bits.push(got.fields + " field" + (got.fields === 1 ? "" : "s"));
      notify(bits.length ? bits.join(" and ") + " added to " + t.label + "."
                         : pageTitle(listPath) + " had nothing left to add to " + t.label + ".");
      render();
    },
  });
}
