/* Edit an area's prompt for an AI, kept at path in 8/Prompts/. back reopens
   the dialog the prompt is used from. */
function openPromptEditor({space, path, standard, hint, back}) {
  const box = el("textarea", {rows: 18, style: "width:100%;font-family:var(--mono);font-size:12px"});
  box.value = planTemplate(space, path, standard);
  const save = async () => {
    try { await planTemplateWrite(space, box.value, path); }
    catch (e) { notify(e.message || String(e), "warn"); return; }
    notify("Saved. This area uses it from now on.");
    back();
  };
  modal({
    center: true, title: "The prompt",
    body: el("div", {class: "field"}, box,
      el("div", {class: "hint", style: "text-align:left;margin-top:6px"}, hint)),
    foot: [
      el("button", {class: "btn ghost", onclick: back}, "Back"),
      el("button", {class: "btn ghost", onclick: () => { box.value = standard; }}, "The standard one"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: save}, "Save"),
    ],
  });
}
