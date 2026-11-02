function openLanguagePaste(name) {
  const box = el("textarea", {style: "width:100%;min-height:260px;font-family:var(--mono);font-size:12px",
    placeholder: "Paste the translated file here"});
  const save = async () => {
    const got = langParse(box.value).pairs, {props, pairs} = langParse(langTextOf(name));
    let n = 0;
    for (const [k, v] of got) if (v && pairs.get(k) !== v) { pairs.set(k, v); n++; }
    if (!n) { notify("Nothing new in it: no lines with a translation after =>.", "warn"); return; }
    try { await langWrite(name, langFileText(name, props, pairs)); }
    catch (e) { notify(e.message || String(e), "warn"); return; }
    notify(n + (n === 1 ? " line" : " lines") + " translated.");
    openLanguageDialog();
  };
  modal({
    center: true, title: "Paste a translation - " + name,
    body: el("div", {}, el("div", {class: "field"}, box,
      el("div", {class: "hint", style: "text-align:left;margin-top:6px"},
        "Lines with a translation after => are taken. Lines you already have stay unless the paste has a new one."))),
    foot: [el("button", {class: "btn ghost", onclick: () => openLanguageDialog()}, "Back"),
      el("div", {style: "flex:1"}), el("button", {class: "btn primary", onclick: save}, "Save")],
  });
  setTimeout(() => box.focus(), 40);
}
