function doneCommentRow(e, after) {
  const input = el("input", {type: "text", placeholder: "Add a comment", "aria-label": "Comment on " + e.label,
    style: "flex:1;min-width:0"});
  const save = () => {
    const text = trim(input.value);
    if (text && addDoneComment(e, text)) { input.value = ""; if (after) after(text); }
  };
  attachSuggest(input);
  input.addEventListener("keydown", ev => {
    if (suggestKey(ev)) return;
    if (ev.key === "Enter") { ev.preventDefault(); save(); }
  });
  return el("div", {style: "display:flex;gap:6px;align-items:center"},
    input, el("button", {class: "btn sm primary", onclick: save}, "Add"));
}
