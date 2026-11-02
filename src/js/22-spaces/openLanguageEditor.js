/* Every line, English beside an input. Saved a moment after you stop typing. */
function openLanguageEditor(name) {
  const {props, pairs} = langParse(langTextOf(name));
  for (const k of [...LANG_CATALOG.s, ...LANG_CATALOG.t]) if (!pairs.has(k)) pairs.set(k, "");
  const seen = [...LANG.missed].filter(k => !pairs.has(k));
  let timer = 0, shown = 150;
  const save = () => {
    clearTimeout(timer);
    timer = setTimeout(() => langWrite(name, langFileText(name, props, pairs)).catch(e => notify(e.message || String(e), "warn")), 700);
  };
  const find = el("input", {type: "search", placeholder: "Find a line", style: "flex:1"});
  const only = el("input", {type: "checkbox"});
  const alsoSeen = el("input", {type: "checkbox"});
  const count = el("span", {class: "hint"});
  const rows = el("div", {style: "display:flex;flex-direction:column;gap:6px;margin-top:10px"});
  const draw = () => {
    const q = trim(find.value).toLowerCase();
    const keys = [...pairs.keys(), ...(alsoSeen.checked ? seen.filter(k => !pairs.has(k)) : [])]
      .filter(k => (!only.checked || !pairs.get(k)) &&
        (!q || k.toLowerCase().includes(q) || String(pairs.get(k) || "").toLowerCase().includes(q)));
    count.textContent = keys.length + (keys.length === 1 ? " line" : " lines");
    rows.replaceChildren(...keys.slice(0, shown).map(k => {
      const input = el("input", {type: "text", value: pairs.get(k) || "", style: "width:100%",
        "aria-label": "Translation"});
      input.addEventListener("input", () => { pairs.set(k, trim(input.value)); save(); });
      return el("div", {style: "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;align-items:center"},
        el("div", {translate: "no", style: "font-size:13px;overflow-wrap:anywhere"}, k), input);
    }), keys.length > shown
      ? el("button", {class: "btn ghost", onclick: () => { shown += 150; draw(); }}, "Show more")
      : null);
  };
  find.addEventListener("input", () => { shown = 150; draw(); });
  only.addEventListener("change", () => { shown = 150; draw(); });
  alsoSeen.addEventListener("change", () => { shown = 150; draw(); });
  modal({
    center: true, title: "Translations - " + name,
    body: el("div", {},
      el("div", {style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap"}, find, count),
      el("label", {style: "display:flex;gap:6px;align-items:center;margin-top:8px"}, only, "Only lines not translated yet"),
      seen.length ? el("label", {style: "display:flex;gap:6px;align-items:center;margin-top:4px"}, alsoSeen,
        "Also " + seen.length + " pieces of text seen on screen that are in no line (may include your own words)") : null,
      rows),
    foot: [el("button", {class: "btn ghost", onclick: () => { clearTimeout(timer);
        langWrite(name, langFileText(name, props, pairs)).catch(() => {}); openLanguageDialog(); }}, "Back"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: () => { clearTimeout(timer);
        langWrite(name, langFileText(name, props, pairs)).catch(e => notify(e.message || String(e), "warn")); closeModal(); }}, "Done")],
  });
  draw();
  setTimeout(() => find.focus(), 40);
}
