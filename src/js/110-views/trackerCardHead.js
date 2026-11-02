/* The top of a tracker's card: the name, what it is, today's page and ⋯ for
   its settings. */
function trackerCardHead(title, about, more) {
  return el("div", {class: "trkhead"},
    el("h4", {}, title),
    el("span", {class: "plain"}, about),
    el("span", {style: "flex:1"}),
    el("button", {class: "textbtn", title: "Fill it in on today's page", onclick: () => go("today")}, "Open today →"),
    el("button", {class: "textbtn trkmore", title: "Icon, colour, chart and style", "aria-label": "Settings for " + title,
      onclick: more}, "⋯"));
}
