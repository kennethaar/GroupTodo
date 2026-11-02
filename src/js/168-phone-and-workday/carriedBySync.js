/* A folder that a sync app (Syncthing, OneDrive, Dropbox) keeps the same on
   phone and PC carries the work by itself: no file to send or bring in. Said
   so once, or read off a folder where no vault file has been brought in for
   two weeks, since the file is then not how the work moves. */
function carriedBySync() {
  if (!onFolderNow()) return false;
  const said = PREF.get("sync.carried", "");
  if (said) return said === "1";
  const last = PREF.get("import.day." + (Spaces.active || ""), "");
  return !last || last < shiftISO(todayISO(), -14);
}
