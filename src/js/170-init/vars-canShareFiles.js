/* ---------- handing a markdown file to the rest of the phone ---------- */
/* A phone in browser storage has no folder to write to, so the file leaves through
   the OS: the share sheet hands it straight to Dropbox, Drive, Nextcloud,
   Syncthing, Signal or mail, which are the sync that GroupToDo does not have.
   Desktops get a download, which is what they wanted anyway. */
const canShareFiles = (type = "text/markdown", name = "x.md") => {
  try { return !!(navigator.canShare && navigator.share &&
                  navigator.canShare({files: [new File(["x"], name, {type})]})); }
  catch (_) { return false; }
};
