/* A settings page: a title, rows, and a way back to the main Settings. */
function settingsDialog(title, groups, back) {
  modal({
    center: true, title,
    body: el("div", {}, ...groups),
    foot: [
      back ? el("button", {class: "btn ghost", onclick: openVaultDialog}, "Settings") : null,
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
    ].filter(Boolean),
  });
}
