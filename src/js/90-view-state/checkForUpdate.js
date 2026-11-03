/* quiet: the daily check, which says nothing unless there is news. Asked for,
   it always answers. */
async function checkForUpdate({quiet = true} = {}) {
  PREF.set("update.checked", todayISO());
  let text;
  try {
    const r = await fetch(REPO_RAW + "CHANGELOG.md", {cache: "no-store"});
    if (!r.ok) throw new Error(r.status);
    text = await r.text();
  } catch (_) {
    if (!quiet) notify("Could not reach GitHub just now. Try again when you are online.", "warn");
    return null;
  }
  const newer = newsEntries(text).filter(e => verCmp(e.version, APP_VERSION) > 0);
  UPDATE = newer.length ? {version: newer[0].version, entries: newer} : null;
  showUpdateBadge();
  if (UPDATE) updateToast(UPDATE);
  else if (!quiet) notify("You have the newest version, v" + APP_VERSION + ". Enjoy!");
  return UPDATE;
}
