/* A download arrow rather than words: the heading has the view's name and its
   readings to fit on a phone, and the tooltip says what it is. */
const csvBtn = (rows, what, label = "Export to Excel") =>
  el("button", {class: "iconbtn csvbtn", title: label + " (a CSV file, which Excel opens)", "aria-label": label,
    onclick: () => exportTasksCsv(rows(), what)}, "\u2913");
