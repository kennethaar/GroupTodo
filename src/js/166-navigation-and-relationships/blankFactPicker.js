function blankFactPicker(path, f) {
  const key = f.key.toLowerCase();
  if (key === "area") { openAreaPicker(path); return; }
  if (key === "depends on") { openDependsPicker(path); return; }
  const save = v => { f.save(f.key + ":: " + v); render(); };
  const write = () => promptInput({title: "Set " + f.key, label: f.key, value: "", cta: "Save", onSave: save});
  if (OWN_VALUE_KEY_RE.test(key)) { write(); return; }
  const kind = FACT_KIND_BY_KEY[key];
  let items;
  if (kind) {
    items = allPages(p => kind === "project" ? !!statusDirOf(p) : pageKind(p) === kind)
      .map(p => ({label: pageTitle(p), value: "[[" + pageRef(p) + "]]"}));
  } else if (key === "status") {
    items = STATUS_ORDER.map(c => ({label: STATUS_LABEL[c], value: c}));
  } else {
    const used = new Set();
    for (const p of allPages())
      for (const [k, v] of Object.entries(getPage(p).props))
        if (k.toLowerCase() === key && trim(v)) used.add(v);
    items = [...used].map(v => ({label: v, value: v}));
  }
  listPicker({
    title: "Choose " + f.key, items, typeahead: true, label: x => x.label, onPick: x => save(x.value),
    footer: el("button", {class: "btn ghost", onclick: write}, "+ another value"),
  });
}
