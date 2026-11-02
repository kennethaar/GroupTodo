async function langWrite(name, text) {
  const rec = langRecord();
  if (!rec || !rec.backend || !rec.backend.writable) throw new Error("This area cannot be written to.");
  if (rec.hold) throw new Error("This area's folder is not connected. Connect it first.");
  await rec.backend.write(langPath(name), text);
  (rec.langs || (rec.langs = new Map())).set(langPath(name), text);
  if (name === PREF.get("lang", "")) { PREF.set("lang.text", text); langUse(name, text); }
}
