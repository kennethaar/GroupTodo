/* After an area is read: English.md is there and has every line this app
   knows, and the chosen language follows the area's copy when it changed.
   Never into a folder on hold: that is the folder somebody lost, not an empty one. */
async function langAfterLoad(record) {
  const b = record.backend;
  if (!b || !b.writable || record.hold) return;
  const path = langPath(LANG_BASE), have = record.langs.get(path);
  const {props, pairs} = langParse(have || "");
  if (have == null || [...LANG_CATALOG.s, ...LANG_CATALOG.t, ...(LANG_CATALOG.w || [])].some(k => !pairs.has(k))) {
    const text = langFileText(LANG_BASE, props, pairs);
    try { await b.write(path, text); record.langs.set(path, text); } catch (_) {}
  }
  const name = PREF.get("lang", "");
  const mine = name && record.langs.get(langPath(name));
  if (mine != null && mine !== PREF.get("lang.text", "")) {
    PREF.set("lang.text", mine);
    langUse(name, mine);
  }
}
