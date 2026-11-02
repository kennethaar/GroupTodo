function runChecklistAsProject(listPath, name, opts = {}) {
  const list = getPage(listPath); if (!list) return null;
  const vars = {name, project: name, date: todayISO()};
  const projectPath = createProjectPage(name);

  const outcomeTpl = trim(list.props?.outcome || "");
  const outcome = trim(opts.outcome || (outcomeTpl ? expandVars(outcomeTpl, vars) : ""));
  if (outcome) setOutcome(projectPath, outcome);

  const areaM = /\[\[a\/([^\]]+)\]\]/.exec(list.props?.area || "");
  if (areaM) setAreaOfProject(projectPath, trim(areaM[1]));
  const goalM = /\[\[g\/([^\]]+)\]\]/.exec(list.props?.goal || "");
  if (goalM) setGoalOfProject(projectPath, trim(goalM[1]));

  const page = getPage(projectPath);
  page.props.from = "[[8/" + baseName(listPath) + "]]";
  const ctx = opts.context || state.context;
  let n = 0;
  const copy = blocks => (blocks || []).map(b => {
    n++;
    const title = expandVars(b.title, vars);
    return stampAuthor(newBlock({
      state: "TODO",
      title: title + (ctx && !hasContextLink(title) ? " [[c/" + ctx + "]]" : ""),
      props: {},
      children: copy(b.children),
    }));
  });
  page.blocks.push(...copy(list.blocks));
  touch(projectPath);
  return {path: projectPath, steps: n};
}
