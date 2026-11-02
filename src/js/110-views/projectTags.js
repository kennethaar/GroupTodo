function projectTags(r) {
  const open = openOf(projectActions(r));
  const code = inSpace(r.space, () => statusDirOf(r.path));
  const blockers = inSpace(r.space, () => blockersOf(r.path).map(pageTitle));
  const out = [];
  if (open.some(a => a.due && a.due < todayISO())) out.push(el("span", {class: "chip late"}, "late"));
  if (blockers.length) out.push(el("span", {class: "chip late"}, "blocked by " + blockers.join(", ")));
  if (autoWaiting(r)) out.push(el("span", {class: "chip today", title: "Every open step is waiting on somebody"}, "Waiting for · auto"));
  if ((code === "1" || code === "3") && !open.length) out.push(el("span", {class: "chip miss"}, "no next step"));
  return out;
}
