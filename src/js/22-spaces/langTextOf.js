function langTextOf(name) {
  const t = langRecord()?.langs?.get(langPath(name));
  if (t != null) return t;
  if (name === PREF.get("lang", "")) return PREF.get("lang.text", "");
  return name === LANG_BASE ? langFileText(LANG_BASE, {}, new Map()) : "";
}
