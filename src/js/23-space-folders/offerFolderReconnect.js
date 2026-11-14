/* One button, no picker: requestPermission() on a handle we already hold names
   the folder itself, so the whole job is saying yes. */
function offerFolderReconnect(name) {
  const h = PENDING_GRANT.get(name);
  if (!h) return;
  const sp = Spaces.get(name);
  const label = sp ? sp.name : name;
  const where = h.name || (sp && sp.label) || "its folder";
  const step = folderAskStep(name);
  modal({
    center: true,
    title: step ? "Folder " + step + ": " + label : "Reconnect " + label,
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "font-size:13.5px"},
          "The browser asks once per folder. Your pages are safe in \u201C" + where + "\u201D."))),
    foot: [
      el("button", {class: "btn primary", onclick: async () => {
        closeModal();
        if (await grantSpaceFolder(name)) offerNextFolder();
      }}, "Allow access"),
      el("button", {class: "btn ghost", onclick: () => {
        closeModal();
        notify("Reconnect it any time from Vault & sync \u2192 Connect folder.", "warn");
      }}, "Not now - use browser storage"),
    ],
  });
}
