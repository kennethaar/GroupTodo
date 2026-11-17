/* What New from a template offers (#420): the built-ins, then every project
   template here by name. Each says what it is, what it adds and its button. */
function templateChoices() {
  const own = checklistPages().filter(isProjectTemplate)
    .sort((a, b) => pageTitle(a).localeCompare(pageTitle(b)))
    .map(path => {
      const n = flattenBlocks(getPage(path).blocks).length;
      const outcome = trim(getPage(path).props?.outcome || "");
      return {path, name: pageTitle(path), kind: "Project",
        blurb: n + (n === 1 ? " step" : " steps") + ". Makes a new project each time you use it." +
          (outcome ? " Done when: " + expandVars(outcome, {name: "…", project: "…"}) + "." : ""),
        parts: [], cta: "Make the project", run: () => runTemplateAsProject(path)};
    });
  return [...BUILTIN_TEMPLATES, ...own];
}
