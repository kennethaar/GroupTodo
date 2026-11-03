function promptInput({title, label, value = "", placeholder = "", multiline = false,
                     cta = "Save", onSave, hint = "", note = null, suggest = false}) {
  const input = multiline
    ? el("textarea", {placeholder})
    : el("input", {placeholder, value});
  if (multiline) input.value = value;
  /* Words for a line -- a next action, an outcome -- get the same names, @
     and [[ as a line does. The chosen key takes one; Escape closes the list, not the box. */
  if (suggest) {
    attachSuggest(input);
    input.addEventListener("keydown", e => { if (suggestKey(e)) e.stopPropagation(); });
  }
  const save = () => { const v = trim(input.value); closeModal(); if (v) onSave(v); };
  modal({
    center: true, title, hint,
    body: el("div", {},
      note,
      el("div", {class: "field"}, el("label", {}, label), input)),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, cta)],
    onKey: e => {
      if (e.key === "Enter" && (!multiline || e.ctrlKey || e.metaKey)) { save(); return true; }
      return false;
    },
  });
  setTimeout(() => input.focus(), 30);
}
