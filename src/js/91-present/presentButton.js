/* ▶ Present ▾ beside Focus on a page (#431): Focus stays one click. ▶ starts
   the slides; ▾ offers them with the presenter window too, so it is in sight
   and not only behind the P key. With `root`, in the trail of a focused line,
   it presents that line. Hovered or focused, ▶ shows a slide (#465): last
   time's, the top, or the line you were in; ↑ ↓ switch. A tap has no hover,
   so it just starts. */
function presentButton(path, root = null) {
  const peek = e => slidePeek(e.currentTarget, path, root);
  return el("span", {class: "presentsplit"},
    el("button", {class: "btn sm ghost presentbtn", title: (root ? "Show this line" : "Show the page") + " as slides in a window of their own (Esc leaves)",
      onpointerenter: e => { if (e.pointerType !== "touch") peek(e); },
      onpointerleave: () => slidePeekLeave(),
      onkeydown: e => {
        if (SLIDE_PEEK?.anchor !== e.currentTarget) return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          SLIDE_PEEK.keyed = true;
          slidePeekPick(SLIDE_PEEK.on + (e.key === "ArrowUp" ? -1 : 1));
        } else if ((e.key === "Enter" || e.key === " ") && SLIDE_PEEK.keyed) {
          // Picked with the arrows: the talk opens there.
          e.preventDefault();
          slidePeekGo();
        }
      },
      onpointerdown: e => { if (e.pointerType === "touch") e.currentTarget.dataset.tap = "1"; },
      onfocus: e => { if (e.currentTarget.dataset.tap) delete e.currentTarget.dataset.tap; else peek(e); },
      onblur: () => slidePeekHide(),
      onclick: () => presentStart(path, {root, win: true})}, "▶ Present"),
    el("button", {class: "btn sm ghost presentmore", title: "More ways to present", "aria-label": "More ways to present",
      "aria-haspopup": "menu", "aria-expanded": "false", onclick: e => presentMenu(path, root, e.currentTarget)}, "▾"));
}
