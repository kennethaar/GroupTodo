/* ============================================================
   125_CONTEXT_SYSTEM
   Port of: init.lua 52_CONTEXT_SYSTEM
   ============================================================ */
function openContextPicker(title, onPick) {
  const items = contextList();
  if (!items.length) { openContextsWizard(onPick); return; }
  listPicker({
    title: title || "Pick context", items,
    typeahead: true,
    label: c => "@" + c,
    detail: c => leafActions().filter(a => a.context === c && OPEN_STATES[a.state]).length + " open",
    // The first context in the alphabet is not an answer: nothing is chosen
    // until you say, unless you are somewhere already.
    start: items.indexOf(state.context),
    onPick,
    footer: el("div", {style: "display:flex;gap:8px;flex-wrap:wrap"},
      el("button", {class: "btn ghost", onclick: () => { closeModal(); newContextPrompt(onPick); }}, "+ new context"),
      /^where are you/i.test(title || "") ? el("button", {class: "btn ghost", onclick: () => { closeModal(); senseNow(); }}, "Sense it") : null),
  });
}
