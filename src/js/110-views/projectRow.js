/* A project in the list, read top to bottom in one pass: the name; where it
   sits and how far along it is, the bar right under the numbers; what is set
   on it, a line each; and who is in it, with the way into its tasks. Nothing
   is said twice -- the area and the organisations are no longer a chip and a
   field both, and the people are their faces, not a clipped list of names.
   The fields still to fill in come up on hover or focus, and in the review. */
function projectRow(r) {
  const info = inSpace(r.space, () => ({title: pageTitle(r.path), area: areaOfProject(r.path)}));
  const acts = projectActions(r);
  const tally = projectTally(r);
  const done = tally.done;
  const open = openOf(acts);
  const total = open.length + done;
  const pct = total ? Math.round(done / total * 100) : 0;
  const who = [...new Set([...open.map(a => a.assignee).filter(Boolean), ...projectPeople(r)])];
  const dot = () => el("span", {class: "sep", "aria-hidden": "true"}, "•");
  const stats = [
    // In All, which folder it sits in is no longer said by the chip on top.
    r._all ? el("span", {class: "chip"}, STATUS_LABEL[effStatus(r)]) : null,
    info.area ? el("span", {class: "chip", title: "Responsibility"}, info.area) : null,
    el("span", {}, open.length + " open"),
    tally.done ? el("span", {}, tally.done + " done") : null,
    tally.dropped ? el("span", {title: "Cancelled, and not counted as done"}, tally.dropped + " dropped") : null,
    ...priceChips(tally),
  ].filter(Boolean).flatMap((x, i) => i ? [dot(), x] : [x]);
  return el("div", {class: "task prow2 pcard", onclick: e => { if (!e.target.closest("[data-link]")) previewPage(r.space, r.path); }},
    el("div", {class: "t-body"},
      parentLine(r.space, r.path),
      el("div", {class: "t-title"}, el("b", {}, info.title)),
      el("div", {class: "pstats"}, ...stats,
        r._urg != null ? el("span", {class: "chip urg onhover", title: "Urgency of its most urgent open action, " +
          "or of its own deadline and chain when it has none. The list is sorted by it."}, "↑" + r._urg) : null,
        ...projectTags(r), spaceTag(r.space)),
      el("div", {class: "pprog", title: done + " of " + total + " done"},
        el("div", {class: "pbar"}, el("i", {style: "width:" + pct + "%"})),
        el("span", {class: "pct"}, pct + "%")),
      projectFieldPills(r, {skip: ["status", "area", "people"], lines: true}),
      el("div", {class: "pfoot"},
        el("div", {class: "avs", title: who.join(", ")}, ...who.slice(0, 4).map(n => avatarNode(n, 24)),
          who.length > 4 ? el("span", {class: "more"}, "+" + (who.length - 4)) : null),
        el("button", {class: "btn ghost sm", onclick: e => { e.stopPropagation(); openPageIn(r.space, r.path); }}, "View tasks"))));
}
