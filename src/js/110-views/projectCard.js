/* A project as a card that a name can be dropped on: the title opens a
   preview, the line under it says how much is open and where it sits, and
   `stakes` are whoever or whatever is on it already. `also` is more words the
   board's text filter should find it by. */
function projectCard(r, title, stakes, more, also) {
  const area = areaOfRow(r);
  const open = openOf(projectActions(r)).length;
  return el("div", {class: "pcard", data: {q: [title, area, ...(also || [])].join(" ").toLowerCase()}},
    parentLine(r.space, r.path),
    el("h4", {onclick: () => previewPage(r.space, r.path)}, title),
    el("div", {class: "t-meta"}, ...projectCountChips(open, projectTally(r)),
      area ? el("span", {class: "chip"}, area) : null, spaceTag(r.space)),
    el("div", {class: "stakes"}, ...stakes),
    more || null);
}
