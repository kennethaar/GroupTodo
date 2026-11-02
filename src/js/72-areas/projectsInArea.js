function projectsInArea(area) {
  return allPages(p => statusDirOf(p) && !isHorizonPage(p)).filter(p => areaOfProject(p) === area);
}
