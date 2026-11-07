/* One thing in a day of the week, or in the review's list: the box, the
   context, the words, and a word under them only when it is out of the
   ordinary -- late, a time, starting, waited for. */
function weekItem(it) {
  const go2 = it.where ? el("button", {class: "wkwhere", title: "Open " + it.where,
    onclick: e => { e.stopPropagation(); it.go(); }}, it.where + " ↗") : null;
  if (it.event) {
    const open = () => openBlockAt(it.space || V.space, it.path, it.block);
    return el("div", {class: "wkitem wkevent", tabindex: "0", role: "button", title: "Open the meeting",
      onclick: open, onkeydown: e => { if (e.key === "Enter") open(); }},
      el("span", {class: "wkmark", "aria-hidden": "true"}, "o"),
      el("div", {class: "wkbody"}, el("div", {class: "wktext"},
        it.time ? el("b", {class: "wktime"}, it.time + " ") : null,
        el("span", {translate: "no", html: renderInline(it.title)}))));
  }
  const a = it.a.space ? it.a : Object.assign({}, it.a, {space: V.space});
  const text = el("span", {translate: "no", html: renderInline(titleForLine(a.title))});
  const ctx = a.context ? el("span", {class: "chip ctx"}, "@" + a.context) : null;
  const sub = it.late ? el("span", {class: "wksub late"}, "! " + it.late + "d late")
    : it.time ? el("span", {class: "wksub"}, it.time)
    : it.kind === "start" ? el("span", {class: "wksub"}, "starts")
    : it.kind === "wait" ? el("span", {class: "wksub wait"}, "waiting") : null;
  const open = () => inSpace(a.space, () => openTaskDetail(a.path, a.block, a.space));
  return el("div", {class: "wkitem", data: {state: a.state || "", id: a.block.id}, tabindex: "0", role: "button",
    onclick: e => { if (!e.target.closest("[data-link]")) open(); },
    onkeydown: e => { if (e.key === "Enter" && e.target === e.currentTarget) open(); }},
    el("div", {class: "t-chk"}, holdable(el("button", {class: "tick", data: {state: a.state || ""},
      title: a.state === "DONE" ? "Not done after all (hold for every state)" : "Done (hold for every state)"},
      ...tickParts(a.state, a.block)),
      () => rowSetState(a, () => setBlockState(a.path, a.block, a.state === "DONE" ? "TODO" : "DONE")),
      () => stateMenu(a))),
    el("div", {class: "wkbody"}, el("div", {class: "wktext"}, ctx, ctx ? " " : null, text), sub),
    go2);
}
