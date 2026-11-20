/* ▶ Present ▾ beside Focus on a page (#431): Focus stays one click. ▶ starts
   the slides; ▾ offers them with the presenter window too, so it is in sight
   and not only behind the P key. With `root`, in the trail of a focused line,
   it presents that line. */
function presentButton(path, root = null) {
  return el("span", {class: "presentsplit"},
    el("button", {class: "btn sm ghost presentbtn", title: (root ? "Show this line" : "Show the page") + " as slides, full screen (Esc leaves)",
      onclick: () => presentStart(path, {root})}, "▶ Present"),
    el("button", {class: "btn sm ghost presentmore", title: "More ways to present", "aria-label": "More ways to present",
      "aria-haspopup": "menu", "aria-expanded": "false", onclick: e => presentMenu(path, root, e.currentTarget)}, "▾"));
}
