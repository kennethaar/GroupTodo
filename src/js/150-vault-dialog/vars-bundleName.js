/* ============================================================
   150_VAULT DIALOG -- connect a folder, a server, or export markdown
   ============================================================ */
/* ============================================================
   148_SERVERLESS_SYNC
   Multi-device sync with no server and no account: the whole vault travels
   as ONE markdown file that you keep in iCloud Drive, OneDrive, Dropbox,
   Google Drive, Syncthing -- whatever already syncs on your devices.

   Each page carries updated:: so a merge can pick the newer side per page
   instead of overwriting the vault wholesale. Deletes travel as tombstones.
   A page edited on both sides since the last sync is never silently lost:
   the loser is kept beside it as a conflict copy.

   Desktop Chrome/Edge can link the file once and re-sync with one click.
   Everywhere else -- iOS Safari included -- the same file round-trips
   through the ordinary Save / Open dialogs, which every browser has.
   ============================================================ */

/* One file per space, so exporting Work never lands on top of Private's file
   in the same synced folder. */
const bundleName = () => "grouptodo-" +
  String(Spaces.active || "vault").toLowerCase().replace(/[^\w-]+/g, "-") + ".md";
