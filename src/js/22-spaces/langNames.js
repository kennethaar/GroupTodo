function langNames() {
  const names = new Set([LANG_BASE]);
  for (const p of langRecord()?.langs?.keys() || []) names.add(langNameOf(p));
  if (PREF.get("lang", "")) names.add(PREF.get("lang", ""));
  return [...names].sort((a, b) => a === LANG_BASE ? -1 : b === LANG_BASE ? 1 : a.localeCompare(b));
}
