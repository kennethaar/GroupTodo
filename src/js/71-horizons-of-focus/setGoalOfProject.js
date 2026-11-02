function setGoalOfProject(path, goal) {
  const page = getPage(path); if (!page) return;
  if (goal) page.props.goal = "[[g/" + goal + "]]"; else delete page.props.goal;
  touch(path);
}
