/* What the report is for, in four lines, the first time you open it. */
function openReportWalkthrough() {
  PREF.set("report.seen", "1");
  const line = (head, body) => el("div", {class: "field"},
    el("label", {}, head),
    el("div", {style: "color:var(--fg2);font-size:13px;line-height:1.55"}, body));
  modal({
    center: true, title: "Reporting",
    body: el("div", {},
      line("What it shows", "Everything closed in a window of time."),
      line("The window", "This week, last quarter, or dates you type."),
      line("Grouped", "By customer to invoice, by person to review, by project to catch up."),
      line("Out", "Copy it, print it, or take it to Excel.")),
    foot: [el("button", {class: "btn primary", onclick: () => closeModal()}, "Got it")],
  });
}
