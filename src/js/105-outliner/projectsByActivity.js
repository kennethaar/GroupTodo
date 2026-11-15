/* Projects, the busiest this week first; then Active, Next and Later, as the
   line menu always listed them. */
function projectsByActivity() {
  const n = projectActivity(), all = [...n.keys()];
  return all.slice().sort((a, b) => n.get(b) - n.get(a) || all.indexOf(a) - all.indexOf(b));
}
