/* Active and waiting projects with no finish line stated. */
const projectsWithoutOutcome = () =>
  allPages(p => ["1", "3"].includes(statusDirOf(p))).filter(p => !outcomeOf(p));
