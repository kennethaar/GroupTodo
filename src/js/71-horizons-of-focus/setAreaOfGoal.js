function setAreaOfGoal(path, area) {
  const page = getPage(path); if (!page) return;
  if (area) page.props.area = "[[a/" + area + "]]"; else delete page.props.area;
  touch(path);
}
