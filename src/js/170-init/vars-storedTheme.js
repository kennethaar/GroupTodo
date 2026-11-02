/* ============================================================
   170_INIT
   ============================================================ */
langStart();
$("#btnSearch").onclick  = () => goSearch();
$("#btnSend").onclick    = () => sendFromPhone();
$("#syncLine").onclick   = () => {
  // A save that is waiting out its retry is tried again on the way in.
  if (V.error) saveNow();
  const held = heldRecords();
  if (held.length) { showHoldDialog(held[0].name); return; }
  openVaultDialog();
};
$("#brand").onclick      = () => go("me");
$("#hideSide").onclick   = () => isNarrow() ? document.body.classList.remove("nav-open") : setSidebarHidden(true);
$("#burger").onclick     = () => toggleSidebar();
$("#btnBack").onclick    = () => navGo(-1);
$("#btnFwd").onclick     = () => navGo(1);
$("#btnTheme").onclick   = () => toggleTheme();
$("#btnHelp").onclick    = () => setHelp(!helpOpen());
$("#spacesBtn").onclick  = e => { e.stopPropagation(); $("#spop").hidden ? openSpacesMenu() : closeSpacesMenu(); };
document.addEventListener("mousedown", e => {
  if (!$("#spop").hidden && !e.target.closest("#spop, #spacesBtn")) closeSpacesMenu();
});
// Tapping a place on a phone puts the drawer away again.
$("#sidebar").addEventListener("click", e => { if (e.target.closest(".nav-item, .brand, #syncLine")) document.body.classList.remove("nav-open"); });
const storedTheme = safeLS.get("gtd.theme");
if (storedTheme) document.documentElement.dataset.theme = storedTheme;
applyStyles();
if (safeLS.get("gtd.sidebarHidden") === "1") setSidebarHidden(true);
installCaptureBox();

// Whatever link you click is brought to the middle of the screen.
document.addEventListener("click", e => {
  const n = e.target.closest("[data-link]");
  if (n) requestAnimationFrame(() => centerLinkText(n));
}, true);
document.addEventListener("keydown", onConvertKey, true);
/* Capturing on window, so these run before the outline's own key handling:
   Alt-S and a whole-line Ctrl-X mean something more than they do in a field. */
window.addEventListener("pointerdown", rememberItemContext, true);
window.addEventListener("focusin", rememberItemContext, true);
window.addEventListener("keydown", onSpaceKey, true);
window.addEventListener("keydown", onRefileKey, true);
window.addEventListener("keydown", onBranchCutKey, true);
window.addEventListener("cut", onBranchCut, true);
window.addEventListener("paste", onBranchPaste, true);
