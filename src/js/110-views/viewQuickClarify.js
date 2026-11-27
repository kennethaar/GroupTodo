/* Clarify, Quick (#523): one line at a time in its day, and one question,
   something to do or a note. The other answers wait: a to do is sorted next,
   in Review actions, and All answers has every one. */
function viewQuickClarify(r, head, undo) {
  if (SIDE_PAGE && SIDE_PAGE.at) SIDE_PAGE = null;
  const {path, block: b} = r;
  const out = qcOutline(path, b);
  const c = el("div", {class: "wrap clquick"}, head,
    el("div", {class: "qcbar"}, el("p", {class: "solhow"}, "One line at a time. Something to do, or just a note?"), clMode()),
    out,
    el("div", {class: "qcdock"},
      el("button", {class: "qcbig qcnote", "aria-keyshortcuts": "N ArrowLeft", onclick: () => qcTake("note")},
        svgIcon(ICON_PENCIL), el("b", {}, "Just a note"), el("small", {}, "stays on the day"), el("kbd", {}, "N")),
      el("button", {class: "qcbig qcdo", "aria-keyshortcuts": "T ArrowRight", onclick: () => qcTake("todo")},
        svgIcon(ICON_BOLT), el("b", {}, "Something to do"), el("small", {}, "sorted next, in Review actions"), el("kbd", {}, "T"))),
    undo,
    el("p", {class: "qcmore"},
      el("button", {class: "textbtn", title: "Space", onclick: () => qcTake("skip")}, "Skip this line ›"), " · ",
      el("button", {class: "textbtn", onclick: () => openBlockAt(V.space, path, b)}, "Open the day page")));
  CL.shown = r;
  // The line at the middle of the box, and the words ready to type in.
  requestAnimationFrame(() => {
    const at = out.querySelector(".qcedit, .qchere");
    if (at) out.scrollTop = Math.max(0, at.getBoundingClientRect().top - out.getBoundingClientRect().top + out.scrollTop - out.clientHeight / 2);
    const input = out.querySelector(".qcedit");
    if (input) { input.focus(); input.select(); }
  });
  return c;
}
