function langStart() {
  const name = PREF.get("lang", "");
  if (name) langUse(name, PREF.get("lang.text", ""));
}
