/* Laid out like a task row: the name gets the full width, what they are
   (organisation, in or out of the area) bottom left, and the counts and the
   one thing to do about them bottom right. Beside the name, the counts and
   the button squeezed it to a letter a line on a phone. */
function personRow(r) {
  return el("div", {class: "task", onclick: () => openPersonPage(r.name)},
    avatarNode(r.name, 30),
    el("div", {class: "t-body"},
      el("div", {class: "t-title"}, el("b", {}, personBareName(r.name) + (r.me ? " (you)" : ""))),
      el("div", {class: "t-meta"},
        el("span", {class: "t-pills"},
          ...personOrgs(r.name).map(o => el("span", {class: "chip"}, o)),
          el("span", {class: "chip" + (r.member ? "" : " today")}, r.member ? "In the area" : "Outside the area"),
          // Outside the area is all there is to say about when they were seen.
          r.member || r.me ? el("span", {class: "chip"}, r.seen) : null, ...[...r.spaces].map(spaceTag)),
        el("span", {class: "t-info"},
          el("span", {class: "rnum"}, r.open.length + " open" + (r.late ? " · " + r.late + " late" : "") +
            (r.owes ? " · owes you " + r.owes : "")),
          personAction(r)))));
}
