/* ---------- Settings > Help ---------- */
function helpSettingsSection() {
  const box = (label, on, set) => {
    const input = el("input", {type: "checkbox", onchange: e => { set(e.target.checked); render(); }});
    input.checked = on;
    return el("label", {class: "helpset"}, input, " ", label);
  };
  return section("Help", null, el("div", {class: "card"},
    el("div", {class: "listblurb"}, "On this device. ? on any screen explains it."),
    box("First-visit notes: one line on each screen the first time you open it", helpHintsOn(),
      on => { PREF.set("help.hints", on ? "1" : "0"); if (on) for (const id of Object.keys(HELP)) PREF.set("help.seen." + id, ""); }),
    box("Show the line menu under the line you edit (else ⋯ or Ctrl+. opens it)", flyOn(),
      on => { PREF.set("fly.show", on ? "1" : ""); if (FLY) flyDraw(); }),
    factFoldPrefs(),
    el("div", {class: "helpsee"}, el("button", {class: "textbtn", onclick: () => openHelp("start")}, "Open full help"))));
}
