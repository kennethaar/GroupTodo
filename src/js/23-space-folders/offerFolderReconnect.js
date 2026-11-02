/* One button, no picker: requestPermission() on a handle we already hold names
   the folder itself, so the whole job is saying yes. */
function offerFolderReconnect(name) {
  const h = PENDING_GRANT.get(name);
  if (!h) return;
  const sp = Spaces.get(name);
  const label = sp ? sp.name : name;
  const where = h.name || (sp && sp.label) || "its folder";
  const others = Array.from(PENDING_GRANT.keys()).filter(n => n !== name);
  modal({
    center: true,
    title: "Reconnect " + label,
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "font-size:13.5px"},
          "The folder " + label + " writes into - \u201C" + where + "\u201D - is still " +
          "remembered. Opening the app from a fresh download only drops the browser's " +
          "permission to it, and that comes back with one click: nothing to find, " +
          "no folder to pick.")),
      el("div", {class: "field"},
        el("div", {style: "font-size:13px;color:var(--fg2)"},
          "Until then " + label + " reads and writes browser storage, and the .md files in " +
          where + " are left exactly as they are.")),
      others.length
        ? el("div", {class: "field"},
            el("div", {style: "font-size:12.5px;color:var(--fg3)"},
              "Waiting the same way: " + others.join(", ") + "."))
        : null),
    foot: [
      el("button", {class: "btn primary", onclick: async () => {
        closeModal();
        const ok = await grantSpaceFolder(name);
        const next = Array.from(PENDING_GRANT.keys())[0];
        if (ok && next) offerFolderReconnect(next);
      }}, "Allow access to " + where),
      el("button", {class: "btn ghost", onclick: () => {
        closeModal();
        notify("Reconnect it any time from Vault & sync \u2192 Connect folder.", "warn");
      }}, "Not now"),
    ],
  });
}
