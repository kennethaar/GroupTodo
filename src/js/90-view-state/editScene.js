/* Its name and its values. A value saved empty comes off. */
function editScene(s) {
  const field = (label, node) => el("div", {class: "field"}, el("label", {}, label), node);
  const name = el("input", {value: s.name});
  const inputs = SCENE_FIELDS.map(([k]) => {
    const input = k === "synopsis" ? el("textarea", {}) : el("input", {});
    input.value = sceneProp(s, k);
    if (SCENE_NAMED.has(k)) attachSuggest(input, {});
    return input;
  });
  const save = () => {
    if (!oneLine(name.value)) { name.focus(); return; }
    closeModal();
    const b = s.block;
    b.title = "## " + oneLine(name.value);
    SCENE_FIELDS.forEach(([k], i) => {
      const v = oneLine(inputs[i].value);
      const had = Object.keys(b.props).find(x => x.toLowerCase() === k);
      if (v) setBlockProp(b, k, v); else if (had) delete b.props[had];
    });
    touch(s.path);
    render();
  };
  modal({center: true, title: "Scene",
    body: el("div", {class: "scenedlg"}, field("Name", name), ...SCENE_FIELDS.map(([, label], i) => field(label, inputs[i]))),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, "Save")],
    onKey: e => {
      if (SUGGEST) return false;
      if (e.key === "Enter" && (e.target.tagName === "INPUT" || e.ctrlKey || e.metaKey)) { save(); return true; }
      return false;
    }});
  setTimeout(() => name.focus(), 30);
}
