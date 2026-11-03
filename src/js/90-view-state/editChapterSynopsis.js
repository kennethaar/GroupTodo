/* Saved empty, it takes the synopsis off. */
function editChapterSynopsis(path) {
  const input = el("textarea", {placeholder: "What happens in it"});
  input.value = chapterSynopsis(path);
  const save = () => { closeModal(); setChapterSynopsis(path, input.value); };
  modal({center: true, title: "Synopsis of " + pageTitle(path),
    body: el("div", {class: "field"}, input),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, "Save")],
    onKey: e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { save(); return true; } return false; }});
  setTimeout(() => input.focus(), 30);
}
