/* The heart of the nudge loop: 3 oldest open actions in the chosen context. */
function oldestTodosForContext(context, n = CFG.surfaceCount) {
  const matches = leafActions().filter(a => {
    if (!inContext(a, context)) return false;
    if (!OPEN_STATES[a.state]) return false;
    // standalone, or under an active / waiting project -- never 0, 2 or _
    return a.projectStatusDir == null || a.projectStatusDir === "1" || a.projectStatusDir === "3";
  });
  matches.sort((x, y) => (x.added || "9999-99-99").localeCompare(y.added || "9999-99-99"));
  return matches.slice(0, n);
}
