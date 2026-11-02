/* Where a line can be refiled: a project, a responsibility, or a context --
   a recurring meeting's context page is where its agenda gathers. */
function refileTargets(fromPath) {
  return [...projectsIn("1"), ...projectsIn("3"), ...projectsIn("2"), ...areaList(),
          ...allPages(p => p.startsWith(DIRS.contexts + "/"))].filter(p => p !== fromPath);
}
