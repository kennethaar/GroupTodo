/* A topic is not an outcome: the box says so while you type, rather than after. */
function npmOutcomeSay(text) {
  const t = trim(text);
  if (!t) return null;
  const name = npmIn(() => pageTitle(NPM.path));
  if (t.toLowerCase() === trim(name).toLowerCase() || t.split(/\s+/).length < 3)
    return ["warn", "That reads like a topic. Say what is true once it is done."];
  return ["ok", "✓ Reads like a finish line."];
}
