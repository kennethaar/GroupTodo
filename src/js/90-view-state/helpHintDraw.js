function helpHintDraw() {
  let box = $("#helpHint");
  const id = helpTopicHere(), t = HELP[id];
  const fresh = PREF.get("help.seen." + id, "") !== "1";
  if (fresh && t.hint && helpHintsOn() && !helpOpen()) { PREF.set("help.seen." + id, "1"); HELP_HINT_NOW = id; }
  if (HELP_HINT_NOW !== id || !helpHintsOn() || helpOpen()) {
    if (box) box.remove();
    if (HELP_HINT_NOW !== id) HELP_HINT_NOW = null;
    return;
  }
  if (box && box.dataset.id === id) return;
  if (box) box.remove();
  const done = () => { HELP_HINT_NOW = null; helpHintDraw(); };
  box = el("div", {id: "helpHint", class: "helphint", role: "note", data: {id}},
    el("span", {class: "helpi", "aria-hidden": "true"}, "ⓘ"),
    el("span", {class: "helphint-t"}, t.hint),
    el("span", {class: "helphint-b"},
      el("button", {class: "btn sm ghost", onclick: () => { done(); setHelp(true); }}, "Explain this page"),
      el("button", {class: "btn sm ghost", onclick: done}, "Got it"),
      el("button", {class: "textbtn", title: "No more of these notes. Settings > Help turns them back on",
        onclick: () => { PREF.set("help.hints", "0"); done(); }}, "No more hints")));
  $("#main").append(box);
}
