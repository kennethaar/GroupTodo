/* A project's open steps: its own lines, and lines in a day page that name it. */
function projectActions(r) {
  return memo("projActs", () => {
    const by = new Map();
    for (const a of leafActions()) {
      if (!a.projectPath) continue;
      const k = (a.space || V.space || "") + "|" + a.projectPath;
      if (!by.has(k)) by.set(k, []);
      by.get(k).push(a);
    }
    return by;
  }).get((r.space || V.space || "") + "|" + r.path) || [];
}
