const unassignedProjects = () =>
  allPages(p => ["1", "3"].includes(statusDirOf(p))).filter(p => !areaOfProject(p));
