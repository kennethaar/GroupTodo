function writePropValue(path, k, value = "") {
  promptInput({title: "Set " + k, hint: pageTitle(path), label: k + "::", value,
    cta: "Save", onSave: nv => { saveRawProp(path, k, k + ":: " + nv); render(); }});
}
