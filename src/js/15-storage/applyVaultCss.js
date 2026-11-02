function applyVaultCss(loading) {
  const seen = new Set(), parts = [];
  // The area being read is not in LOADED until its read is done.
  for (const rec of new Set([...LOADED.values(), loading].filter(Boolean))) {
    for (const [path, text] of [...(rec.css || new Map())].sort(([a], [b]) => a.localeCompare(b))) {
      if (seen.has(text)) continue;        // the same file kept in two areas
      seen.add(text);
      parts.push("/* " + (rec.name || "") + ": " + path + " */\n" + text);
    }
  }
  let tag = document.getElementById("vault-css");
  if (!parts.length) { if (tag) tag.remove(); return; }
  if (!tag) tag = el("style", {id: "vault-css"});
  document.head.append(tag);               // last, every time, so it stays on top
  if (tag.textContent !== parts.join("\n\n")) tag.textContent = parts.join("\n\n");
}
