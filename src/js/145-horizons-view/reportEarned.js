function reportEarned() {
  if (PREF.get("report.unlocked", "") === "1") return true;
  return memo("reportEarned", () => {
    const mine = r => !isTourProject(r.path) && !isTourProject(r.projectPath) && !tourDestOf(r.title);
    const tasks = completedSince(addMonths(todayISO(), -24)).filter(r => !r.undated && mine(r)).length;
    const projects = projectsIn("0").filter(q => !isTourProject(q)).length;
    if (tasks < REPORT_MIN_TASKS && projects < REPORT_MIN_PROJECTS) return false;
    // Quietly: a feature appearing is not news worth stopping you for.
    PREF.set("report.unlocked", "1");
    return true;
  });
}
