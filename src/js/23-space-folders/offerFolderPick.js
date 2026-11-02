/* The folder itself is gone from this browser, so the one way back is the
   picker, which opens where this area's folder last was. */
function offerFolderPick(name) {
  if (!LOST_FOLDER.has(name)) return;
  const sp = Spaces.get(name);
  if (!CAP.dirPicker) {
    notify((sp ? sp.name : name) + " is kept in a folder, and this browser cannot open folders: " +
           "what you see here is browser storage, not the folder.", "warn");
    return;
  }
  const label = sp ? sp.name : name;
  const where = (sp && sp.label) ? "\u201C" + sp.label + "\u201D" : "its folder";
  const others = Array.from(LOST_FOLDER).filter(n => n !== name);
  modal({
    center: true,
    title: "Find " + label + "'s folder",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "font-size:13.5px"},
          label + " is kept in " + where + ", but this browser no longer has that folder, " +
          "so it cannot read it. Nothing is lost: the files are where they were. Pick " +
          where + " again to open them.")),
      el("div", {class: "field"},
        el("div", {style: "font-size:13px;color:var(--fg2)"},
          "Until then what you see in " + label + " is browser storage, not the folder, and " +
          "nothing is written to " + where + ".")),
      others.length
        ? el("div", {class: "field"},
            el("div", {style: "font-size:12.5px;color:var(--fg3)"},
              "Also without their folder: " + others.join(", ") + "."))
        : null),
    foot: [
      el("button", {class: "btn primary", onclick: async () => {
        closeModal();
        const ok = await assignSpaceFolder(name);
        const next = ok && Array.from(LOST_FOLDER)[0];
        if (next) offerFolderPick(next);
      }}, "Pick " + (sp && sp.label ? sp.label : "the folder")),
      el("button", {class: "btn ghost", onclick: () => {
        closeModal();
        notify("Pick it any time from Vault & sync \u2192 Connect folder.", "warn");
      }}, "Not now"),
    ],
  });
}
