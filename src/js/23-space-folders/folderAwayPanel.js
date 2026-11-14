function folderAwayPanel(name) {
  const sp = Spaces.get(name);
  const label = sp ? sp.name : name;
  const pending = PENDING_GRANT.get(name);
  const where = (pending && pending.name) || (sp && sp.label) || "its folder";
  const back = pending
    ? el("button", {class: "btn primary", onclick: async () => {
        loadStep(name, "Allow access tapped");
        if (!await grantSpaceFolder(name)) render();
        else offerNextFolder();
      }}, "Allow access to " + where)
    : CAP.dirPicker
      ? el("button", {class: "btn primary", onclick: async () => {
          await assignSpaceFolder(name);
          render();
        }}, "Pick " + where)
      : null;
  const step = folderAskStep(name);
  return el("div", {class: "wrap folderaway", role: "alert"},
    el("h2", {}, (pending ? "Reconnect " + label : label + " is in \u201C" + where + "\u201D") +
      (step ? " \u00B7 " + step : "")),
    el("p", {}, pending
      ? "Your pages are safe in \u201C" + where + "\u201D. The browser asks for each folder again " +
        "after a fresh start, one area at a time."
      : CAP.dirPicker
        ? "Your pages are safe in the folder, but this browser has lost it. Pick it again to open them."
        : "Your pages are in the folder, and this browser cannot open folders."),
    el("div", {class: "row"},
      back,
      el("button", {class: "btn ghost", onclick: () => { AWAY_OK.add(name); render(); }},
        "Not now")),
    el("p", {class: "quiet"},
      "Not now uses browser storage, which holds only what was saved in this browser. " +
      "The folder is left as it is."));
}
