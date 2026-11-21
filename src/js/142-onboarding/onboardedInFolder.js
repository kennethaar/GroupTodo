/* A new browser on a folder somebody has already set up: the folder says
   onboarding is done, so it is taken as done here too, with no
   getting-started guide (#457). Reads GTD.md without making one. */
function onboardedInFolder() {
  for (const name of new Set([V.space, ...LOADED.keys()])) {
    if (!name || folderWaiting(name)) continue;
    const date = inSpace(name, () => V.pages.get(SETTINGS_PATH)?.props?.onboarded);
    if (!date) continue;
    PREF.set("onboarded", String(date));
    if (!PREF.get("coach")) PREF.set("coach", "0");
    return true;
  }
  return false;
}
