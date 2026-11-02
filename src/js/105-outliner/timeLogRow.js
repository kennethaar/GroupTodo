function timeLogRow(e) {
  const a = trim(blockProp(e.block, "in") || ""), z = trim(blockProp(e.block, "out") || "");
  const stale = timeLogOpen(e.block) && e.date < todayISO();
  return el("button", {class: "reprow",
    onclick: () => inSpace(e.space, () => openTimeForm(e.path, e.block, {leaving: timeLogOpen(e.block)}))},
    el("span", {class: "when"}, humanDate(e.date)),
    el("span", {class: "what", translate: "no", html: renderInline([e.who, timeLogNote(e.block)].filter(Boolean).join(" · "))}),
    el("span", {class: "marks"},
      e.project ? el("span", {class: "chip proj"}, e.project) : null,
      stale ? el("span", {class: "chip late"}, "in " + a + " · no time out")
        : el("span", {class: "chip"}, (a ? a + "–" + (z || "…") + " · " : "") + fmtMinutes(timeLogMin(e)))));
}
