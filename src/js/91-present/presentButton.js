// ▶ Present beside Focus on a page (#431): Focus stays one click.
function presentButton(path) {
  return el("button", {class: "btn sm ghost presentbtn", title: "Show the page as slides, full screen (Esc leaves)",
    onclick: () => presentStart(path)}, "▶ Present");
}
