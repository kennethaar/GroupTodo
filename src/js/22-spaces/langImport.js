/* A language file somebody gave you, laid onto this app's catalog and kept
   under its own name. */
async function langImport(text, fileName) {
  const {props, pairs} = langParse(text);
  if (![...pairs.values()].some(Boolean)) { notify("That file has no translated lines in it.", "warn"); return false; }
  const name = langFileName(props.language || String(fileName || "").replace(/\.(md|txt)$/i, ""));
  if (!name || name === LANG_BASE) { notify("That file has no language name in it.", "warn"); return false; }
  try { await langWrite(name, langFileText(name, props, pairs)); }
  catch (e) { notify(e.message || String(e), "warn"); return false; }
  langChoose(name);
  notify(name + " is in 8/Languages and shown on this device.");
  return true;
}
