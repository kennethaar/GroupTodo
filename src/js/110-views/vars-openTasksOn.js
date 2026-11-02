/* The open tasks written on a page, or on a project wherever they are written. */
const openTasksOn = (space, path) => leafActions().filter(a => (a.space || V.space) === (space || V.space) &&
  (a.path === path || a.projectPath === path) && OPEN_STATES[a.state]);
/* What a person page or a context page says about itself. */
const pageProp = (space, path, key) => inSpace(space, () => trim(String(getPage(path)?.props?.[key] || "")));
