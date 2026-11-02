const projectsForGoal = goal =>
  allPages(p => statusDirOf(p) && !isHorizonPage(p)).filter(p => goalOfProject(p) === goal);

/* Goals nobody is actually working on: the classic H3 failure. */
const goalsWithoutProjects = () =>
  goalList().filter(g => !projectsForGoal(baseName(g)).some(p => ["1", "3"].includes(statusDirOf(p))));

/* ============================================================
   74_PROJECT_OUTCOME
   "What would done look like?" A project named Website is a noun nobody
   can finish. A project named Website live and taking bookings is a
   finish line. Stored as outcome:: so it stays greppable markdown.
   ============================================================ */
const OUTCOME_PLACEHOLDER = /what does done look like|what has to be true/i;
