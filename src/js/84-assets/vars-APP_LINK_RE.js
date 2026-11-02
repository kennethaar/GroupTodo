/* The line is the target, so a file let go anywhere else would otherwise make
   the browser leave the app and open it. Say where it should have gone. */
window.addEventListener("dragover", e => {
  if (Array.from((e.dataTransfer && e.dataTransfer.types) || []).includes("Files")) e.preventDefault();
});
window.addEventListener("drop", e => {
  const files = e.dataTransfer && e.dataTransfer.files;
  if (!files || !files.length) return;
  e.preventDefault();
  notify("Drop a file onto a line to attach it to it.", "warn");
});

/* ============================================================
   85_INLINE_RENDER
   ============================================================ */
/* Addresses that belong to another app on the device: the mail client, the
   phone or dialler, the maps app, Teams. tel:// is how people often write it,
   so the slashes are dropped; teams:someone@x has no handler of its own and
   goes through Teams' chat link, which hands over to the desktop app.
   telto: is tel: spelt like mailto:, and mapto:Storgata 1, Oslo is an address
   the map searches for, written the way it is said. */
const APP_LINK_RE = /^(?:mailto|tel|telto|sms|geo|mapto|msteams|teams):/i;
