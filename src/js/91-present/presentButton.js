/* ▶ Present ▾ beside Focus on a page (#431): Focus stays one click. ▶ starts
   the slides; ▾ offers them with the presenter window too, so it is in sight
   and not only behind the P key. */
function presentButton(path) {
  return el("span", {class: "presentsplit"},
    el("button", {class: "btn sm ghost presentbtn", title: "Show the page as slides, full screen (Esc leaves)",
      onclick: () => presentStart(path)}, "▶ Present"),
    el("button", {class: "btn sm ghost presentmore", title: "More ways to present", "aria-label": "More ways to present",
      "aria-haspopup": "dialog", onclick: () => presentMenu(path)}, "▾"));
}
