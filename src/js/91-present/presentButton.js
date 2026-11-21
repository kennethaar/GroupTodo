/* ▶ Present ▾ beside Focus on a page (#431): Focus stays one click. ▶ starts
   the slides; ▾ offers them with the presenter window too, so it is in sight
   and not only behind the P key. With `root`, in the trail of a focused line,
   it presents that line. Hovered or focused, ▶ shows the slide you were last
   on (#465); a tap has no hover, so it just starts. */
function presentButton(path, root = null) {
  const peek = e => slidePeek(e.currentTarget, path, root);
  return el("span", {class: "presentsplit"},
    el("button", {class: "btn sm ghost presentbtn", title: (root ? "Show this line" : "Show the page") + " as slides, full screen (Esc leaves)",
      onpointerenter: e => { if (e.pointerType !== "touch") peek(e); },
      onpointerleave: e => { if (document.activeElement !== e.currentTarget) slidePeekHide(); },
      onpointerdown: e => { if (e.pointerType === "touch") e.currentTarget.dataset.tap = "1"; },
      onfocus: e => { if (e.currentTarget.dataset.tap) delete e.currentTarget.dataset.tap; else peek(e); },
      onblur: () => slidePeekHide(),
      onclick: () => presentStart(path, {root})}, "▶ Present"),
    el("button", {class: "btn sm ghost presentmore", title: "More ways to present", "aria-label": "More ways to present",
      "aria-haspopup": "menu", "aria-expanded": "false", onclick: e => presentMenu(path, root, e.currentTarget)}, "▾"));
}
