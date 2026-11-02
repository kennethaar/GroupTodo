function sdCard(space, r, other, side) {
  const info = inS(r, () => ({title: pageTitle(r.path), outcome: trim(getPage(r.path)?.props?.outcome || ""),
    area: areaOfProject(r.path)}));
  const idle = solIdle(r), open = openOf(projectActions(r)).length;
  const pick = () => sdPick(space, r, other, side);
  const arrow = side ? "→" : "←";
  return el("div", {class: "sdside", data: {side: String(side)}},
    el("div", {class: "solcard", role: "button", tabindex: "0", title: "Choose this one (" + arrow + ")",
      onclick: e => { if (!e.target.closest("button")) pick(); },
      onkeydown: e => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); pick(); } }},
      el("kbd", {class: "solkey", "aria-hidden": "true"}, arrow),
      parentLine(r.space, r.path),
      el("h3", {translate: "no"}, info.title),
      info.outcome && info.outcome !== info.title ? el("p", {translate: "no"}, info.outcome) : null,
      el("div", {class: "t-meta"},
        info.area ? el("span", {class: "chip", translate: "no"}, info.area) : null,
        el("span", {class: "chip"}, idle == null ? "never reviewed" : "untouched for " + idle + " days"),
        el("span", {class: "chip"}, open + " open")),
      el("div", {class: "t-meta"}, el("button", {class: "textbtn", onclick: () => previewPage(r.space, r.path)}, "Open the page"))),
    el("button", {class: "btn", onclick: pick}, "Choose this one"));
}
