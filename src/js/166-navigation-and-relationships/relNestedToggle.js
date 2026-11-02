function relNestedToggle() {
  const input = el("input", {type: "checkbox",
    onchange: e => { PREF.set("boardNested", e.target.checked ? "1" : "0"); render(); }});
  input.checked = PREF.get("boardNested", "0") === "1";
  return el("label", {class: "rel-nest-toggle"}, input, " Indent children under parents");
}
