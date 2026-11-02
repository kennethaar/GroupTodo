/* Settings > Help: which kinds of page open with their values folded. */
function factFoldPrefs() {
  return el("div", {class: "pfprefs"}, el("div", {class: "pfprefhead"}, "Fold the values at the top of:"),
    ...Object.keys(PAGE_KINDS).map(kind => {
      const input = el("input", {type: "checkbox",
        onchange: e => { PREF.set(factsFoldKey(kind), e.target.checked ? "1" : "0"); render(); }});
      input.checked = factsFoldedByDefault(kind);
      return el("label", {}, input, " " + PAGE_KINDS[kind]);
    }));
}
