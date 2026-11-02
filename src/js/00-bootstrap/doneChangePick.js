/* Meant to park it rather than finish it: the other shelves to put it on
   instead, picked from a list. On hold keeps it active, held to a day. */
function doneChangePick(e, pick) {
  const sel = el("select", {class: "btn sm ghost", "aria-label": "Change " + e.label + " to", title: "Not done after all: put it somewhere else",
    // As narrow as its label: the list it opens is as wide as it needs.
    style: "width:7.5em;flex:0 0 auto", onchange: () => { const v = sel.value; sel.value = ""; if (v) pick(v); }},
    el("option", {value: ""}, "Change…"),
    ...["1", "3", "2"].map(c => el("option", {value: c}, STATUS_LABEL[c])),
    el("option", {value: "hold"}, "On hold until a day"),
    el("option", {value: "-"}, STATUS_LABEL["-"]));
  return sel;
}
