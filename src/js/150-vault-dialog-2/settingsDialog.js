/* A settings page: a title, rows, and a way back to Vault & sync. */
function settingsDialog(title, groups, back) {
  modal({
    center: true, title,
    body: el("div", {}, ...groups),
    foot: [
      back ? el("button", {class: "btn ghost", onclick: openVaultDialog}, "Vault & sync") : null,
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
    ].filter(Boolean),
  });
}
