// The People view's own "New person", staying here instead of opening the page.
function newCastPrompt(type = "character") {
  if (type === "character") return pickName({title: "Person", items: [], prefix: "p", onPick: n => { if (makeCastPage(n)) render(); }});
  promptInput({title: "New " + type, label: "Name", cta: "Add", onSave: v => { if (makeCastPage(v, type)) render(); }});
}
