/* The readings of a view, as one segmented control at the end of the heading. */
/* On a phone the same readings are one dropdown, "List ▾", beside the title. */
function viewSeg(view) {
  const cur = subNow();
  const subs = SUBS[view].filter(([k]) => k === cur || subShown(view, k));
  /* The weekly review is a reading of Projects that has screens of its own:
     it opens as its own view, and its switch leads back here. */
  if (view === "projects") subs.push(["@review", "Weekly review" + (reviewDue() ? " •" : "")]);
  if (view === "review") subs.unshift(["@projects", "‹ Projects"]);
  const pick = k => k === "@review" ? go("review") : k === "@projects" ? go("projects") : pickSub(view, k);
  const now = subs.find(([k]) => k === cur);
  return el("span", {class: "vswitch"},
    el("div", {class: "vseg", role: "group", "aria-label": "View as"},
      ...subs.map(([k, label]) => el("button", {"aria-pressed": String(cur === k),
        onclick: () => pick(k)}, label))),
    el("span", {class: "vsel"}, el("span", {"aria-hidden": "true"}, (now ? now[1] : "") + " ", svgIcon(ICON_CARET)),
      fselect("View as", cur, subs, pick)));
}
