function installPlannerTimer() {
  const tick = () => {
    for (const area of LOADED.keys())
      if (inSpace(area, plannerIsMine)) plannerSync(area).catch(() => {});
  };
  setTimeout(tick, 20000);
  setInterval(tick, PLANNER_EVERY_MS);
}
