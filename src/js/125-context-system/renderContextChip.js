/* Surface the 3 oldest actions in a context -- the core nudge loop. */
function renderContextChip() {
  const btn = $("#btnContext");
  if (!btn) return;
  btn.textContent = "";
  // Not on the Journal: the day page is not filtered by context, so the chip
  // only took a row of its own there and pushed the area button down.
  if (!state.context || state.view === "today") { btn.hidden = true; return; }
  btn.hidden = false;
  btn.title = "You are in @" + state.context + " - click to change";
  btn.onclick = () => openContextPicker("Where are you now?", ctx => surfaceContext(ctx));
  btn.append(el("span", {}, "@" + state.context));
  btn.append(el("span", {class: "x", title: "Leave this context",
    onclick: e => { e.stopPropagation(); clearContext(); }}, "\u00D7"));
}
