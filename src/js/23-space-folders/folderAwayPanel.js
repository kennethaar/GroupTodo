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
      }}, "Allow access")
    : CAP.dirPicker
      ? el("button", {class: "btn primary", onclick: async () => {
          await assignSpaceFolder(name);
          render();
        }}, "Pick " + where)
      : null;
  const ask = pending ? reconnectText(name, label, where) : null;
  return el("div", {class: "wrap folderaway", role: "alert"},
    el("h2", {}, ask ? ask.title : label + " is in \u201C" + where + "\u201D"),
    el("p", {}, ask
      ? ask.body
      : CAP.dirPicker
        ? "Your pages are safe in the folder, but this browser has lost it. Pick it again to open them."
        : "Your pages are in the folder, and this browser cannot open folders."),
    el("div", {class: "row"},
      el("button", {class: "btn ghost", onclick: () => { AWAY_OK.add(name); render(); }},
        "Not now - use browser storage"),
      back));
}
