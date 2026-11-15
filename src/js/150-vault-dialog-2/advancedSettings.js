/* Settings > Advanced, shown on the page (#397). */
function advancedSettings() {
  const onFolder = V.backend && V.backend.kind === "fs";
  const http = V.backend && V.backend.kind === "http";
  const serverInput = el("input", {
    placeholder: "http://127.0.0.1:8777", "aria-label": "Sync server address",
    value: safeLS.get("gtd.server") || (CAP.served ? location.origin : "http://127.0.0.1:8777"),
  });
  const form = el("div", {class: "field", style: "display:none"},
    el("div", {style: "display:flex;gap:8px"}, serverInput,
      el("button", {class: "btn ghost", onclick: () => connectServer(trim(serverInput.value))}, "Connect")));
  const server = settingsRow("Sync server", http ? "Connected" : "Not connected",
    el("button", {class: "btn sm ghost", onclick: () => {
      if (http) { safeLS.del("gtd.server"); notify("Server forgotten."); render(); }
      else form.style.display = form.style.display === "none" ? "" : "none";
    }}, http ? "Forget" : "Set up"));
  const relink = CAP.savePicker && LINKED
    ? settingsRow("Phone file", LINKED.name || "Linked", el("button", {class: "btn sm ghost", onclick: () => linkVaultFile()}, "Link another"))
    : null;
  const check = onFolder
    ? settingsRow("Vault diagnostics", null,
        el("button", {class: "btn sm ghost", onclick: () => openFolderCheck()}, "Check folder"))
    : null;
  return settingsGroup("Advanced", [server, form, relink, check]);
}
