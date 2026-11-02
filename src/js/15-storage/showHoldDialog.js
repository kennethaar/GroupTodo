function showHoldDialog(name) {
  const rec = LOADED.get(name);
  if (!rec || !rec.hold) return;
  const {reason, had, seen} = rec.hold;
  const label = spaceLabel(name);
  const where = (rec.backend && rec.backend.label) || "its folder";
  const what = reason === "missing"
    ? "The folder “" + where + "” cannot be found."
    : "The folder “" + where + "” opened with " + (seen ? "only " + seen : "no") +
      " page" + (seen === 1 ? "" : "s") + " in it. Last time on this device it had " + had + ".";
  modal({
    center: true,
    title: label + (reason === "missing" ? "'s folder is missing" : "'s folder looks empty"),
    body: el("div", {},
      el("div", {class: "field"}, el("div", {style: "font-size:13.5px"},
        what + " Nothing has been written to it.")),
      el("div", {class: "field"}, el("div", {style: "font-size:13px;color:var(--fg2)"},
        "Most often OneDrive or another sync app has not finished downloading, the drive is " +
        "not connected, or the folder was moved or renamed. Your notes are most likely still " +
        "where they were. Until you choose below, GroupToDo will not write to this folder.")),
    ),
    foot: [
      el("button", {class: "btn primary", onclick: () => { closeModal(); retryHold(name); }}, "Try again"),
      rec.backend && rec.backend.kind === "fs" && CAP.dirPicker
        ? el("button", {class: "btn ghost", onclick: () => { closeModal(); assignSpaceFolder(name); }}, "Choose the folder")
        : null,
      el("button", {class: "btn ghost", onclick: () => { closeModal(); releaseHold(name); }},
        reason === "missing" ? "Keep it in this browser" : "It is meant to be empty"),
    ],
  });
}
