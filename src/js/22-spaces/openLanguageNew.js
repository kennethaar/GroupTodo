function openLanguageNew() {
  const name = el("input", {type: "text", placeholder: "Name, as it is written in the language: Norsk, Deutsch…"});
  const code = el("input", {type: "text", placeholder: "Code, for example nb, de, sv (optional)", style: "margin-top:8px"});
  const make = async () => {
    const n = langFileName(name.value);
    if (!n) { name.focus(); return; }
    if (n === LANG_BASE) { notify("English is already there.", "warn"); return; }
    const old = langRecord()?.langs?.get(langPath(n));
    const {props, pairs} = langParse(old || "");
    try { await langWrite(n, langFileText(n, {...props, code: trim(code.value) || props.code || ""}, pairs)); }
    catch (e) { notify(e.message || String(e), "warn"); return; }
    langChoose(n);
    openLanguageEditor(n);
  };
  name.addEventListener("keydown", e => { if (e.key === "Enter") make(); });
  modal({
    center: true, title: "Translate it yourself",
    body: el("div", {}, el("div", {class: "field"}, el("label", {}, "Which language"), name, code,
      el("div", {class: "hint", style: "text-align:left;margin-top:6px"},
        "Makes 8/Languages/<name>.md with every line in English. Fill in the lines here, in any editor, " +
        "or copy the file to an AI and paste back what it gives you."))),
    foot: [el("button", {class: "btn ghost", onclick: () => openLanguageDialog()}, "Back"),
      el("div", {style: "flex:1"}), el("button", {class: "btn primary", onclick: make}, "Start")],
  });
  setTimeout(() => name.focus(), 40);
}
