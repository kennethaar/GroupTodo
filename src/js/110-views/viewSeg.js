/* The readings of a view, as one segmented control at the end of the heading. */
/* On a phone the same readings are one dropdown, "List ▾", beside the title. */
function viewSeg(view) {
  const cur = subNow();
  const subs = SUBS[view].filter(([k]) => k === cur || subShown(view, k));
  const now = subs.find(([k]) => k === cur);
  return el("span", {class: "vswitch"},
    el("div", {class: "vseg", role: "group", "aria-label": "View as"},
      ...subs.map(([k, label]) => el("button", {"aria-pressed": String(cur === k),
        onclick: () => pickSub(view, k)}, label))),
    el("span", {class: "vsel"}, el("span", {"aria-hidden": "true"}, (now ? now[1] : "") + " ▾"),
      fselect("View as", cur, subs, k => pickSub(view, k))));
}
