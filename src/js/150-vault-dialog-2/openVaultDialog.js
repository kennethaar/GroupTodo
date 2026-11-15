/* #397 Vault & sync is a part of Settings, not a dialog of its own: the sync
   line, the area menu and every other way to it open the page there. */
function openVaultDialog(part = "sync") {
  tourMarkSeen("vault");
  for (let i = 0; i < 4 && $("#modalRoot").firstChild; i++) closeModal();
  go("checklists");
  settingsShow(part);
}
