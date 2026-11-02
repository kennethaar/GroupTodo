/* One line of a page and what is under it, with the way back out above it. */
function sideBranchView(s, page, root) {
  const trail = branchTrail(page.blocks, root.id);
  const crumbs = el("div", {class: "crumbz"},
    el("button", {class: "textbtn", title: "The whole page here", onclick: () => focusSide(null)}, "⤶ " + pageTitle(s.path)));
  for (const b of trail.slice(0, -1))
    crumbs.append(el("span", {}, "›"), el("button", {class: "textbtn", onclick: () => focusSide(b)}, branchLabel(b)));
  crumbs.append(el("span", {}, "›"), el("b", {}, branchLabel(root)));
  return el("div", {class: "wrap"}, el("div", {class: "pcrumbs"}, spaceBadge(s.space)), crumbs, pageOutline(s.path, {branch: root.id}));
}
