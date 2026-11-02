function npmSave() {
  if (!NPM || npmLocked()) return;
  NPM.at = nowStamp();
  NPM.by = whoAmI() || "";
  PREF.set(npmKey(NPM.space, NPM.path), JSON.stringify(NPM));
  clearTimeout(NPM_WRITE_T);
  const d = JSON.parse(JSON.stringify(NPM));
  NPM_WRITE_T = setTimeout(() => npmFileWrite(d), 600);
}
