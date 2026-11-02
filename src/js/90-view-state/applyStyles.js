function applyStyles() {
  const r = document.documentElement;
  r.dataset.light = themeOf("light");
  r.dataset.dark = themeOf("dark");
  const font = FONTS.find(f => f.id === PREF.get("style.font", "system"));
  const size = Number(PREF.get("style.size", "15")) || 15;
  const rules = [];
  if (font && font.css) rules.push("--sans:" + font.css);
  if (size !== 15) rules.push("--font-size:" + size + "px");
  let tag = document.getElementById("pref-css");
  if (!tag) {
    tag = el("style", {id: "pref-css"});
    // Before your own stylesheet, never after it, so a .css file still wins.
    const vault = document.getElementById("vault-css");
    if (vault) vault.before(tag); else document.head.append(tag);
  }
  tag.textContent = rules.length ? ":root{" + rules.join(";") + "}" : "";
}
