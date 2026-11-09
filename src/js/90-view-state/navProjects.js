/* The responsibilities, unfolded under Projects: each one opens the active
   projects narrowed to it, the same pick as Area in Projects' filter. Its
   badge is the capital of the area it sits in, on that area's colour, so two
   areas' rows tell apart at a glance. Its count is how many active projects it
   holds, most first; No area comes last among equals. */
function navProjects() {
  const active = visibleProjects("1");
  const at = state.view === "projects" && subNow() === "list" ? PREF.get("projects.area", "") : null;
  const by = new Map(), home = new Map();
  for (const r of active) {
    const k = areaOfRow(r) || "-";
    by.set(k, (by.get(k) || 0) + 1);
    if (!home.has(k)) home.set(k, r.space);
  }
  const areas = Array.from(by).sort((x, y) => y[1] - x[1] || (x[0] === "-") - (y[0] === "-") || x[0].localeCompare(y[0]));
  const badge = k => {
    const sp = k === "-" ? null : home.get(k);
    if (!sp) return el("span", {class: "ic bw"}, "–");
    const c = spaceColor(sp);
    return el("span", {class: "ic area-ic", style: "background:" + c + ";color:" + inkOn(c)}, sp.slice(0, 1).toUpperCase());
  };
  return areas.map(([k, n]) => el("button", {
    class: "nav-item small nav-sub" + (at === k ? " active" : ""),
    "aria-current": at === k ? "page" : null,
    title: k === "-" ? "Active projects in no area" : "The active projects in " + k + (home.get(k) ? " (" + home.get(k) + ")" : ""),
    onclick: () => { PREF.set("projects.area", k); go("projects", {sub: "list", statusCode: "1"}); },
  },
    badge(k),
    el("span", {class: "lbl"}, k === "-" ? "No area" : k),
    el("span", {class: "cnt"}, String(n))));
}
