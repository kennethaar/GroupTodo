/* Onboarding done, written into the area's own folder (GTD.md onboarded::),
   so another browser that opens the same folder does not ask again (#457).
   Only once the folder is read: GTD.md made up in its place would be saved
   over the real one. */
function stampOnboarded(name) {
  const date = PREF.get("onboarded");
  if (!date || !name || folderWaiting(name)) return;
  if (name !== V.space && !LOADED.has(name)) return;
  inSpace(name, () => { if (!getSetting("onboarded")) setSetting("onboarded", date); });
}
