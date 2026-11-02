/* A day page of yours opens on Today at that day, beside the other areas'. */
function pageRow(r) {
  const mine = r.kind === "journal" && myJournal(r.path);
  return el("div", {class: "task", title: mine ? "Open this day in Journal" : "",
    onclick: () => mine ? go("today", isWeekPath(r.path) ? {sub: "week", todayWeek: baseName(r.path), todayWho: null, jz: null}
      : {sub: null, todayDay: baseName(r.path), todayWho: null, jz: null}) : previewPage(r.space, r.path)},
    kindDot(r.kind),
    el("div", {class: "t-body"}, el("div", {class: "t-title"}, r.title),
      el("div", {class: "t-meta"}, el("span", {class: "chip"}, PAGE_KIND_ONE[r.kind] || "Page"),
        el("span", {class: "chip", title: r.path}, r.path.replace(/\/[^/]*$/, "/")),
        el("span", {class: "chip"}, r.links + (r.links === 1 ? " link" : " links")),
        r.edited && r.kind !== "journal" ? el("span", {class: "chip"}, "edited " + humanDate(r.edited)) : null,
        r.kind === "journal" ? el("span", {class: "chip"}, humanDate(baseName(r.path))) : null, spaceTag(r.space))),
    el("span", {class: "rnum"}, "›"));
}
