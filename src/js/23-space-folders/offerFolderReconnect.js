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
    title: "Reconnect " + label + (step ? " \u00B7 " + step : ""),
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "font-size:13.5px"},
          "Your pages are safe in \u201C" + where + "\u201D. The browser asks for each folder " +
          "again after a fresh start, one area at a time.")),
      el("div", {class: "field"},
        el("div", {style: "font-size:13px;color:var(--fg2)"},
          "Not now uses browser storage. The folder is left as it is."))),
    foot: [
      el("button", {class: "btn primary", onclick: async () => {
        closeModal();
        if (await grantSpaceFolder(name)) offerNextFolder();
      }}, "Allow access to " + where),
      el("button", {class: "btn ghost", onclick: () => {
        closeModal();
        notify("Reconnect it any time from Vault & sync \u2192 Connect folder.", "warn");
      }}, "Not now"),
    ],
  });
}
