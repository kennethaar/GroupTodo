/* The "By ..." list in the done toast: everybody who takes turns. */
function choreCreditPick(e) {
  const crew = inSpace(e.space, choreCrew);
  const sel = el("select", {class: "btn sm ghost donecredit", "aria-label": "Who did " + e.credit.label,
    title: "Who did it gets the points", style: "width:auto;flex:0 0 auto",
    onchange: () => e.credit.set(sel.value)},
    ...crew.map(m => el("option", {value: m.name}, "By " + (m.me ? "me" : firstNameOf(m.name)))));
  sel.value = (crew.find(m => samePerson(m.name, e.credit.who)) || crew.find(m => m.me) || crew[0] || {}).name || "";
  return sel;
}
