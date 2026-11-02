/* Weeding ranks the stalest of many projects. With a handful of each it has
   nothing to say, so it is never suggested -- though g w still opens it for
   anyone who wants to look. */
function weedingWorthIt() {
  const projects = projectsIn("1").length;
  if (projects < CFG.weedMinProjects) return false;
  return openOf(leafActions()).length >= CFG.weedMinTodos;
}
