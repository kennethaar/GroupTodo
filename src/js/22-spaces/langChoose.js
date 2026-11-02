function langChoose(name) {
  const text = langTextOf(name);
  PREF.set("lang", name);
  PREF.set("lang.text", text);
  langUse(name, text);
  if (typeof render === "function") render();
}
