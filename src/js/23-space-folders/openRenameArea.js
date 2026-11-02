/* Renaming asks who the new name is for. Just for me is this browser's word
   for the area; for everyone writes it into the folder, where whoever joins
   from now on starts with it. An area only in this browser has nobody else
   to ask about. */
function openRenameArea(name) {
  const sp = Spaces.get(name);
  if (!sp) return;
  const shared = sp.kind === "fs" || sp.kind === "http";
  const input = el("input", {value: sp.name, maxlength: "40"});
  const apply = async everyone => {
    const v = trim(input.value);
    closeModal();
    if (!v) { openSpaceStorageSetup(); return; }
    const was = sp.name;
    if (v !== was && !await Spaces.rename(was, v)) { openSpaceStorageSetup(); return; }
    delete sp.nameFrom;
    if (everyone) {
      sp.named = true; delete sp.nameLocal;
      try { if (!LOADED.has(sp.name)) await loadSpaceRecord(sp.name); } catch (_) {}
      if (LOADED.has(sp.name)) { inSpace(sp.name, () => setSetting("area_name", sp.name)); await flush(); }
    } else if (shared) sp.nameLocal = true;
    else sp.named = true;
    await Spaces.save();
    notify(v === was ? (everyone ? "“" + was + "” is now the name in its folder." : "Nothing changed.")
                     : was + " is now called " + sp.name + (everyone ? ", for everyone in the folder." : "."));
    render();
    openSpaceStorageSetup();
  };
  modal({
    center: true, title: "Rename " + sp.name,
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "Name"), input),
      shared ? el("div", {style: "color:var(--fg3);font-size:12.5px;line-height:1.5"},
        "Just for me changes what this browser calls it. For everyone writes the name into " +
        "“" + (sp.label || "its folder") + "” as well, so anybody who joins from now on - " +
        "by invite or by pointing at the folder - starts with it. People already in it keep " +
        "what they call it.") : null),
    foot: [
      el("button", {class: "btn ghost", onclick: () => { closeModal(); openSpaceStorageSetup(); }}, "Cancel"),
      el("div", {style: "flex:1"}),
      shared ? el("button", {class: "btn ghost", onclick: () => apply(false)}, "Just for me") : null,
      el("button", {class: "btn primary", onclick: () => apply(true)}, shared ? "For everyone" : "Rename"),
    ],
    onKey: e => { if (e.key === "Enter") { apply(!shared); return true; } return false; },
  });
  setTimeout(() => { input.focus(); input.select(); }, 30);
}
