function folderAwayPanel(name) {
  const sp = Spaces.get(name);
  const label = sp ? sp.name : name;
  const pending = PENDING_GRANT.get(name);
  const where = (pending && pending.name) || (sp && sp.label) || "its folder";
  const back = pending
    ? el("button", {class: "btn primary", onclick: async () => {
        if (!await grantSpaceFolder(name)) render();
        else offerNextFolder();
      }}, "Allow access to " + where)
    : CAP.dirPicker
      ? el("button", {class: "btn primary", onclick: async () => {
          await assignSpaceFolder(name);
          render();
        }}, "Pick " + where)
      : null;
  return el("div", {class: "wrap folderaway", role: "alert"},
    el("h2", {}, label + " is in “" + where + "”"),
    el("p", {}, pending
      ? "Your pages are safe in the folder. This device asks for it again each time the app starts."
      : CAP.dirPicker
        ? "Your pages are safe in the folder, but this browser has lost it. Pick it again to open them."
        : "Your pages are in the folder, and this browser cannot open folders."),
    el("div", {class: "row"},
      back,
      el("button", {class: "btn ghost", onclick: () => { AWAY_OK.add(name); render(); }},
        "Not now - use browser storage")),
    el("p", {class: "quiet"},
      "Browser storage holds only what was saved in this browser, not what is in the folder."));
}
