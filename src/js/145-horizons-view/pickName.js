/* Pick a name, or type one that does not exist yet: a tag you cannot add
   because the page for it has not been made is a dead end for no reason. */
function pickName({title, items, prefix, onPick}) {
  const newOne = () => promptInput({
    title: "New " + title.toLowerCase(), label: "Name", cta: "Use it",
    onSave: v => onPick(prefix === "c" ? slugify(v.replace(/^@/, "")) : trim(v)),
  });
  if (!items.length) { newOne(); return; }
  listPicker({
    title, items, typeahead: true,
    label: n => (prefix === "c" ? "@" : "") + n,
    onPick,
    footer: el("button", {class: "btn ghost", onclick: () => { closeModal(); newOne(); }}, "+ new"),
  });
}
