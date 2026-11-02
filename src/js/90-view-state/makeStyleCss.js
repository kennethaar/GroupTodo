async function makeStyleCss() {
  const rec = langRecord();
  if (!rec || !rec.backend || !rec.backend.writable || !["fs", "http"].includes(rec.backend.kind))
    return notify("A stylesheet lives in a chosen folder. Pick a folder for this area first.");
  if (rec.hold) return notify("This area's folder is not connected. Connect it first.");
  const path = styleCssPath();
  if (rec.css && rec.css.has(path)) return notify("There is already a " + path + ". Open it in any text editor.");
  await rec.backend.write(path, STYLE_CSS_TEMPLATE);
  (rec.css || (rec.css = new Map())).set(path, STYLE_CSS_TEMPLATE);
  applyVaultCss();
  notify("Made " + path + " in " + (rec.backend.label || "the area's folder") + ". Open it in any text editor.");
  render();
}
