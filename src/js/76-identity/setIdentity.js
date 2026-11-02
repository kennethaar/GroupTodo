function setIdentity(name, space) {
  const clean = trim(name).slice(0, 60);
  const was = whoAmI();
  if (space) PREF.set("identity:" + space, clean || NO_NAME);
  else PREF.set("identity", clean);
  if (!clean || !V.pages) return;
  if (was && !samePerson(was, clean)) renameIdentity(was, clean);
  migrateJournals();
  ensureMemberPage();
}
