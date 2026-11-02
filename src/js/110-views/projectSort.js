/* The Sort menu of Projects, list and board alike, and the order it puts
   them in. Numbers as numbers: 99 before 243 before 1000, not 1000 first
   because 1 < 2. Sorted by urgency, each project carries its arrow chip. */
function projectSort() {
  const psort = ["az", "za"].includes(PREF.get("projects.sort", "urgency")) ? PREF.get("projects.sort") : "urgency";
  const byName = (x, y) => rowTitle(x).localeCompare(rowTitle(y), undefined, {numeric: true, sensitivity: "base"});
  const opts = [["urgency", "By urgency"], ["az", "By name, A-Z, 1-9"], ["za", "By name, Z-A, 9-1"]];
  const set = v => { PREF.set("projects.sort", v); render(); };
  const sel = fselect("Sort", psort, opts, set);
  sel.title = "A project is as urgent as its most urgent open action, or its own deadline and its place in a chain.";
  const apply = list => {
    list.forEach(r => { r._urg = psort === "urgency" ? projectUrgency(r.path, r.space) : null; });
    return list.sort(psort === "urgency" ? (x, y) => y._urg - x._urg || byName(x, y)
      : psort === "za" ? (x, y) => byName(y, x) : byName);
  };
  return {sort: psort, sel, apply, opts, set};
}
