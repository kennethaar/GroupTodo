/* The areas, unfolded under Projects: each one opens the active projects
   narrowed to it, the same pick as Area in Projects' filter. Its count is how
   many active projects it holds, most first; No area comes last among equals. */
function navProjects() {
  const active = visibleProjects("1");
  const at = state.view === "projects" && subNow() === "list" ? PREF.get("projects.area", "") : null;
  const by = new Map();
  for (const r of active) { const k = areaOfRow(r) || "-"; by.set(k, (by.get(k) || 0) + 1); }
  const areas = Array.from(by).sort((x, y) => y[1] - x[1] || (x[0] === "-") - (y[0] === "-") || x[0].localeCompare(y[0]));
  return areas.map(([k, n]) => el("button", {
    class: "nav-item small nav-sub" + (at === k ? " active" : ""),
    "aria-current": at === k ? "page" : null,
    title: k === "-" ? "Active projects in no area" : "The active projects in " + k,
    onclick: () => { PREF.set("projects.area", k); go("projects", {sub: "list", statusCode: "1"}); },
  },
    el("span", {class: "ic bw"}, k === "-" ? "–" : k.slice(0, 1).toUpperCase()),
    el("span", {class: "lbl"}, k === "-" ? "No area" : k),
    el("span", {class: "cnt"}, String(n))));
}
